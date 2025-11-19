import { forwardRef } from 'react';

/**
 * Input Component
 * Mobile-first, touch-friendly input field
 * Prevents iOS zoom with text-base size
 * 
 * @param {string} type - Input type: 'text', 'email', 'phone', 'password', 'search'
 * @param {string} label - Input label
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {boolean} fullWidth - Full width on mobile
 */
const Input = forwardRef(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    // Generate ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Base classes - Mobile-first
    const baseClasses = `
      text-base
      w-full
      px-4 py-3
      bg-white
      border-2 rounded-lg
      shadow-sm
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
      min-h-[44px] touch-target
      hover:shadow-md
    `;

    // Border and focus classes based on error state
    const borderClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
      : 'border-gray-300 focus:border-[#3d096d] focus:ring-[#3d096d]/20';

    const classes = `
      ${baseClasses}
      ${borderClasses}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={fullWidth ? 'w-full' : 'w-full md:w-auto'}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-primary mb-2"
          >
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={classes}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-error"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p
            id={`${inputId}-helper`}
            className="mt-1 text-sm text-text-secondary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

