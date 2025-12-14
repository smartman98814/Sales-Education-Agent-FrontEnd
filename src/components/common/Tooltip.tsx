'use client';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import React, { type ForwardedRef, type ReactElement, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TooltipProps {
  tooltip: React.ReactNode;
  children: ReactElement;
  sideOffset?: number;
  className?: string;
  arrowClassName?: string;
  tooltipStyle?: React.CSSProperties;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  delay?: number;
  disable?: boolean;
}

export const Tooltip = forwardRef(
  (
    {
      tooltip,
      children,
      sideOffset = 5,
      className = '',
      arrowClassName = '',
      tooltipStyle = {},
      position = 'top',
      maxWidth = 250,
      delay = 0,
      disable = false,
    }: TooltipProps,
    _ref: ForwardedRef<HTMLElement>,
  ) => {
    return (
      <TooltipPrimitive.Root delayDuration={delay}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          {!disable && (
            <TooltipPrimitive.Content
              side={position}
              className={twMerge(
                'z-[2000]',
                'px-2.5 py-1.5',
                'max-h-[300px]',
                'select-none',
                'rounded-md',
                'bg-gray-900 text-white',
                'text-sm leading-tight',
                'shadow-lg',
                'animate-in fade-in-0 zoom-in-95',
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
                className,
              )}
              sideOffset={sideOffset}
              style={{
                maxWidth,
                ...tooltipStyle,
              }}
            >
              <div className="break-words">{tooltip}</div>
              <TooltipPrimitive.Arrow
                className={twMerge('fill-gray-900', arrowClassName)}
                width={12}
                height={6}
              />
            </TooltipPrimitive.Content>
          )}
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    );
  },
);

Tooltip.displayName = 'Tooltip';

export const TooltipProvider = TooltipPrimitive.TooltipProvider;
