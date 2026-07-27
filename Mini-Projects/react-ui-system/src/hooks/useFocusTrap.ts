import { useEffect, useRef } from 'react';

const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])';

export function useFocusTrap(isActive: boolean) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const element = ref.current;
    if (!element) return;

    const focusableElements = Array.from(
      element.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS_SELECTOR)
    ).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        el.getAttribute('aria-hidden') !== 'true'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);

    // Initial focus
    if (firstElement) {
      firstElement.focus();
    } else {
      element.focus();
    }

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return ref;
}
