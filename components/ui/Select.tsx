import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  containerClassName?: string;
  placeholder?: string; // Added placeholder prop
}

const Select: React.FC<SelectProps> = ({ 
  label, 
  id, 
  name, 
  value, 
  onChange, 
  options, 
  className = '', 
  error, 
  containerClassName = '', 
  placeholder, // Destructured placeholder
  ...props 
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-neutral-dark mb-1">
          {label}
        </label>
      )}
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className={`block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-DEFAULT focus:border-primary-DEFAULT transition-colors duration-150 ease-in-out ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''} ${className}`}
        {...props}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
