import React, { forwardRef } from 'react';
import { cn } from '@lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const textareaVariants = cva('textarea', {
  variants: {
    variant: {
      default: '',
      error: 'textarea-error',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ variant: error ? 'error' : variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
