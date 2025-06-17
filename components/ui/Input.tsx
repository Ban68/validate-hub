
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, name, type = 'text', value, onChange, placeholder, className = '', error, containerClassName = '', ...props }, ref) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-neutral-dark mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref} // Forward the ref to the input element
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-colors duration-150 ease-in-out ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Optional: for better debugging

export default Input;
