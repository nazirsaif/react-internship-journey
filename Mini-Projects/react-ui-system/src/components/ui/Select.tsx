import React, { forwardRef } from 'react';
import { cn } from '@lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const selectVariants = cva('select', {
  variants: {
    variant: {
      default: '',
      error: 'select-error',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ variant: error ? 'error' : variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
