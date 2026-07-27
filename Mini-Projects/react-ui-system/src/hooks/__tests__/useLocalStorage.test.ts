import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should return initial value if no localStorage value exists', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value if it exists', () => {
    window.localStorage.setItem('test-key', JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    expect(result.current[0]).toBe('stored-value');
  });

  it('should update state and localStorage when setter is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should support functional updates', () => {
    window.localStorage.setItem('counter', JSON.stringify(10));
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1](prev => prev + 5);
    });

    expect(result.current[0]).toBe(15);
    expect(window.localStorage.getItem('counter')).toBe(JSON.stringify(15));
  });
});
