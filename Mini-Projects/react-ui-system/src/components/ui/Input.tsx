import React, { forwardRef } from 'react';
import { cn } from '@lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva('input', {
  variants: {
    variant: {
      default: '',
      error: 'input-error',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, error, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: error ? 'error' : variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
