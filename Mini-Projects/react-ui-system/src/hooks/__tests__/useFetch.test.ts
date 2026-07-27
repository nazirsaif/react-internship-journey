import { renderHook, act, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';
import { vi } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch if url is empty', async () => {
    const { result } = renderHook(() => useFetch(''));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should fetch data successfully', async () => {
    const mockData = { name: 'Test' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useFetch('https://api.example.com/data'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch('https://api.example.com/not-found'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('HTTP error! status: 404');
    expect(result.current.data).toBeNull();
  });

  it('should abort request on unmount', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    
    mockFetch.mockImplementationOnce(() => new Promise(() => {})); // Never resolves

    const { unmount } = renderHook(() => useFetch('https://api.example.com/data'));
    
    unmount();
    
    expect(abortSpy).toHaveBeenCalled();
  });
});
