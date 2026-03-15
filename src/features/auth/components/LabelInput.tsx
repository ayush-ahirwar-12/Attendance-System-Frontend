"use client";

import React from 'react';

interface LabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Made optional in case you want to handle labels externally
  type: string;
  id?: string;
  placeholder: string;
  error?: string; // Added error prop for better UI feedback
}

const LabelInput = React.forwardRef<HTMLInputElement, LabelInputProps>(({
  label,
  type,
  id,
  placeholder,
  error,
  className,
  ...rest
}, ref) => {
  const generatedId = React.useId();
  const _id = id || generatedId;

  return (
    <div className="flex flex-col w-full gap-1.5 group">
      {label && (
        <label
          htmlFor={_id}
          className="text-[13px] font-bold uppercase tracking-wider text-gray-400 ml-1 group-focus-within:text-blue-600 transition-colors duration-200"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type}
          id={_id}
          placeholder={placeholder}
          ref={ref}
          className={`
            w-full text-base font-medium
            bg-gray-50/50 
            border-2 border-gray-100 
            rounded-2xl px-5 py-3.5 
            outline-none transition-all duration-200
            placeholder:text-gray-400 text-gray-900
            hover:border-gray-200
            focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...rest}
        />
      </div>

      {error && (
        <span className="text-[11px] font-semibold text-red-500 ml-2 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  )
})

LabelInput.displayName = 'LabelInput';

export default LabelInput;