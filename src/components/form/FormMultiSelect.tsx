'use client';

import { Icon } from '@iconify/react';
import { useEffect, useId, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: { label: string; value: string }[];
  error?: FieldError;
  placeholder?: string;
  maxItems?: number;
  minItems?: number;
  wrapperClassName?: string;
  className?: string;
}

export const FormMultiSelect = ({
  label,
  value = [],
  onChange,
  options,
  error,
  placeholder = 'Select items...',
  maxItems = 10,
  minItems = 1,
  wrapperClassName,
  className,
}: Props) => {
  const inputId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (isSelected) {
      // Only allow removal if we have more than minItems
      if (value.length > minItems) {
        onChange(value.filter((v) => v !== optionValue));
      }
    } else {
      // Only allow addition if we haven't reached maxItems
      if (value.length < maxItems) {
        onChange([...value, optionValue]);
      }
    }
  };

  const handleRemoveItem = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (value.length > minItems) {
      onChange(value.filter((v) => v !== itemValue));
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedLabels = value.map((v) => options.find((opt) => opt.value === v)?.label || v);

  return (
    <div className={twMerge('space-y-4', wrapperClassName)}>
      <div className="w-full" ref={dropdownRef}>
        {label && (
          <label htmlFor={inputId} className="block text-sm text-gray-350 mb-2 cursor-pointer">
            {label}
            <span className="text-gray-500 ml-2 text-xs">
              ({value.length}/{maxItems} selected, min: {minItems})
            </span>
          </label>
        )}

        <div className="relative">
          {/* Main select trigger */}
          <div
            className={twMerge(
              'w-full px-3 py-2 border bg-black-light cursor-pointer',
              'rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500/50',
              error ? 'border-red-300' : 'border-gray-700',
              className,
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            {value.length === 0 ? (
              <span className="text-gray-600">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedLabels.map((label, index) => (
                  <span
                    key={value[index]}
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-indigo-600/50 text-white rounded"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(value[index], e)}
                      className={twMerge(
                        'hover:text-red-400',
                        value.length <= minItems &&
                          'opacity-50 cursor-not-allowed hover:text-white',
                      )}
                      disabled={value.length <= minItems}
                    >
                      <Icon icon="lucide:x" className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-black-light border border-gray-700 rounded shadow-lg">
              {/* Search input */}
              <div className="p-2 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-2 py-1 bg-gray-800 text-white text-sm rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Options list */}
              <div
                className={twMerge(
                  'max-h-60 overflow-y-auto',
                  // Custom scrollbar styles
                  'scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600',
                  'hover:scrollbar-thumb-gray-500',
                  // Webkit scrollbar styles for browsers that don't support scrollbar-color
                  '[&::-webkit-scrollbar]:w-2',
                  '[&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-track]:rounded',
                  '[&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded',
                  '[&::-webkit-scrollbar-thumb:hover]:bg-gray-500',
                )}
                style={{
                  // Modern scrollbar-color property for Firefox and other supporting browsers
                  scrollbarColor: '#4b5563 #1f2937',
                  scrollbarWidth: 'thin',
                }}
              >
                {filteredOptions.length === 0 ? (
                  <div className="p-2 text-gray-500 text-sm">No options found</div>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = value.includes(option.value);
                    const isDisabled = !isSelected && value.length >= maxItems;

                    return (
                      <div
                        key={option.value}
                        className={twMerge(
                          'flex items-center justify-between px-3 py-2 text-sm text-white hover:bg-indigo-600/30',
                          isSelected && 'bg-indigo-600/50',
                          isDisabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                          !isDisabled && 'cursor-pointer',
                        )}
                        onClick={() => !isDisabled && handleToggleOption(option.value)}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <Icon icon="lucide:check" className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer info */}
              <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
                {value.length >= maxItems && (
                  <span className="text-orange-400">Maximum {maxItems} skills reached</span>
                )}
                {value.length === minItems && (
                  <span className="text-blue-400">Minimum {minItems} skill required</span>
                )}
                {value.length > minItems && value.length < maxItems && (
                  <span>Select up to {maxItems - value.length} more</span>
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};
