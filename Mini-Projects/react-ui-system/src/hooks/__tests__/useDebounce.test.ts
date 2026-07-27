import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';
import { vi } from 'vitest';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value change', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'initial' },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated' });
    
    // Value should not update immediately
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated');
  });

  it('should cancel the previous timer if value changes again before delay', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    act(() => { vi.advanceTimersByTime(300); }); // 300ms passed, not enough

    rerender({ value: 'third' });
    act(() => { vi.advanceTimersByTime(300); }); // 300ms from 'third', 600ms total

    // Should still be 'first' because the 'second' timer was cancelled
    expect(result.current).toBe('first');

    act(() => { vi.advanceTimersByTime(200); }); // Now 500ms since 'third'
    expect(result.current).toBe('third');
  });
});
