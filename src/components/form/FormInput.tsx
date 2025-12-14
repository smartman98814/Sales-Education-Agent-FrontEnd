'use client';

import { InputHTMLAttributes, useId } from 'react';
import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props {
  label?: string;
  error?: FieldError;
}
export const FormInput = ({
  label,
  error,
  className,
  ...props
}: Props & InputHTMLAttributes<HTMLInputElement>) => {
  const inputId = useId();

  return (
    <div className="space-y-4">
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm text-gray-350 mb-2 cursor-pointer">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type="text"
          className={twMerge(
            'w-full px-3 py-2 border bg-black-light text-white placeholder:text-gray-600',
            'rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500/50',
            error ? 'border-red-300' : 'border-gray-700',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};
