import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

function Select({ options, placeholder, className = '', label, ...props }: SelectProps) {
  return (
    <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className={`w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        defaultValue=""
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder || 'Select an option'}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;