import { renderHook, act } from '@testing-library/react';
import { useDebounce, useLocalStorage } from '@internal/ui-system';
import { jest } from '@jest/globals';

describe('useDebounce', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });

  it('should return debounced value', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'test1', delay: 500 }
    });

    expect(result.current).toBe('test1');

    rerender({ value: 'test2', delay: 500 });
    expect(result.current).toBe('test1'); // Not updated yet

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('test2');
  });
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value and save to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    expect(window.localStorage.getItem('test-key')).toBeNull();

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });
});
