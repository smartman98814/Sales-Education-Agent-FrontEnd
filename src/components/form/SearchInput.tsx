'use client';

import { Icon } from '@iconify/react';
import _ from 'lodash';
import { ChangeEvent, InputHTMLAttributes, useId, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export const SearchInput = ({
  value,
  setValue,
  className,
  ...props
}: { value: string; setValue: (val: string) => void } & InputHTMLAttributes<HTMLInputElement>) => {
  const [searchTerm, setSearchTerm] = useState(value);
  const inputId = useId();
  const [focused, setFocused] = useState<boolean>(false);

  // Memoize the debounced function so it doesn't recreate on every render
  const debouncedSetSearchTerm = useMemo(
    () =>
      _.debounce((val: string) => {
        setValue(val);
      }, 500), // delay
    [],
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    debouncedSetSearchTerm(e.target.value); // call debounced function
  };

  return (
    <div className="relative">
      <div className="absolute w-6 h-6 left-4 top-1/2 -translate-y-1/2">
        <Icon
          icon="mingcute:search-line"
          className={twMerge('w-full h-full text-gray-700', focused && 'text-indigo-500')}
        />
      </div>
      <input
        id={inputId}
        type="text"
        className={twMerge(
          'rounded-full border border-gray-700 focus:outline-none focus:border-indigo-500 pl-11 pr-4 py-2',
          className,
        )}
        value={searchTerm}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {value.trim().length > 0 && (
        <button
          type="button"
          className="absolute cursor-pointer w-6 h-6 right-4 top-1/2 -translate-y-1/2"
          onClick={() => {
            setValue('');
            setSearchTerm('');
          }}
        >
          <Icon
            icon="ic:round-close"
            className={twMerge('w-full h-full text-gray-700', focused && 'text-indigo-500')}
          />
        </button>
      )}
    </div>
  );
};
