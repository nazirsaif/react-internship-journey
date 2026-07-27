import { clsx, type ClassValue } from 'clsx';

/**
 * Combines multiple class names using clsx.
 * In a Tailwind setup, you would typically wrap this in tailwind-merge,
 * but for our CSS custom properties setup, clsx is perfectly sufficient
 * to cleanly combine conditional classes from CVA.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
