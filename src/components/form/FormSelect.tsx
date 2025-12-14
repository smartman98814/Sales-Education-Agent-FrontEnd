'use client';

import { Icon } from '@iconify/react';
import * as Select from '@radix-ui/react-select';
import { useId } from 'react';
import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

const SelectItem = ({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) => {
  return (
    <Select.Item
      value={value}
      className={twMerge(
        "relative flex cursor-pointer select-none items-center rounded px-2 py-1.5 text-sm text-white data-[highlighted]:outline-none data-[highlighted]:bg-indigo-600/30 data-[state='checked']:bg-indigo-600/60",
        className,
      )}
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
};

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: FieldError;
  placeholder?: string;
  wrapperClassName?: string;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
}

export const FormSelect = ({
  label,
  value,
  onChange,
  options,
  wrapperClassName,
  className,
  contentClassName,
  itemClassName,
  placeholder,
  error,
}: Props) => {
  const inputId = useId();

  return (
    <div className={twMerge('space-y-4', wrapperClassName)}>
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm text-gray-350 mb-2 cursor-pointer">
            {label}
          </label>
        )}
        <Select.Root value={value} onValueChange={onChange}>
          <Select.Trigger
            className={twMerge(
              'w-full px-3 py-2 flex justify-between border bg-black-light',
              'rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500/50',
              error ? 'border-red-300' : 'border-gray-700',
              value && value !== '' ? 'text-white' : 'text-gray-600',
              className,
            )}
          >
            <Select.Value placeholder={placeholder} />
            <Select.Icon className="py-0.5">
              <Icon icon="lucide:chevron-down" className="w-5 h-5" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content
              className={twMerge(
                'overflow-hidden rounded border bg-black shadow shadow-white/50',
                contentClassName,
              )}
            >
              <Select.ScrollUpButton className="flex h-6 items-center justify-center bg-gray-50">
                <Icon icon="lucide:chevron-up" className="w-5 h-5 text-white" />
              </Select.ScrollUpButton>
              <Select.Viewport className="p-1">
                {options.map(({ label, value }, index) => (
                  <SelectItem key={index} value={value} className={itemClassName}>
                    {label}
                  </SelectItem>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton className="flex h-6 items-center justify-center bg-gray-50">
                <Icon icon="lucide:chevron-down" className="w-5 h-5 text-white" />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
      </div>
    </div>
  );
};
