import { renderHook, act } from '@testing-library/react';
import { useThrottle } from '../useThrottle';
import { vi } from 'vitest';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useThrottle('test', 500));
    expect(result.current).toBe('test');
  });

  it('should return the updated value after the throttle delay', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe('updated');
  });

  it('should drop intermediate values if updated multiple times within delay', () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 500), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'v1' });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: 'v2' });
    act(() => vi.advanceTimersByTime(200));

    rerender({ value: 'v3' });
    // It's been 400ms. Hasn't hit 500ms yet
    expect(result.current).toBe('initial');

    act(() => vi.advanceTimersByTime(100)); // Total 500ms
    expect(result.current).toBe('v3');
  });
});
