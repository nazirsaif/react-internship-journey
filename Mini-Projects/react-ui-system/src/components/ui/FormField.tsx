import React, { useId } from 'react';
import { cn } from '@lib/utils';

export interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactElement;
}

export function FormField({ label, error, hint, className, children }: FormFieldProps) {
  const defaultId = useId();
  const inputId = children.props.id || defaultId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    hint ? hintId : null,
    error ? errorId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={cn('form-field', className)}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      
      {React.cloneElement(children, {
        id: inputId,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        error: !!error, // pass error prop to trigger styling if supported
      })}

      {hint && (
        <p id={hintId} className="form-hint">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
