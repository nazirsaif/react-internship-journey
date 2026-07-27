import { renderHook } from '@testing-library/react';
import { useIntersectionObserver } from '../useIntersectionObserver';
import { vi } from 'vitest';

const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class MockIntersectionObserver {
  observe = mockObserve;
  disconnect = mockDisconnect;
  unobserve = vi.fn();
  
  constructor(public callback: IntersectionObserverCallback) {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

describe('useIntersectionObserver', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should observe the element ref', () => {
    const mockRef = { current: document.createElement('div') };
    
    renderHook(() => useIntersectionObserver(mockRef));
    
    expect(mockObserve).toHaveBeenCalledWith(mockRef.current);
  });

  it('should disconnect on unmount', () => {
    const mockRef = { current: document.createElement('div') };
    
    const { unmount } = renderHook(() => useIntersectionObserver(mockRef));
    unmount();
    
    expect(mockDisconnect).toHaveBeenCalled();
  });
});
