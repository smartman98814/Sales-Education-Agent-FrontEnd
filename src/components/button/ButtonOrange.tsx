import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  innerClassName?: string;
  contentClassName?: string;
  showShadow?: boolean;
  disabledGrayType?: boolean;
}

export const ButtonOrange = ({
  disabled,
  children,
  className,
  innerClassName,
  contentClassName,
  showShadow = true,
  disabledGrayType = false,
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <>
      <button
        className={twMerge(
          'w-full block cursor-pointer border border-black/25 rounded-full p-[5px] min-w-20 hover:opacity-90 disabled:cursor-not-allowed',
          !disabledGrayType && 'disabled:opacity-50',
          className,
        )}
        disabled={disabled}
        {...props}
      >
        <div
          className={twMerge(
            'w-full flex relative rounded-full flex items-center p-px flex',
            'border border-black/25 bg-[linear-gradient(90deg,_#000000_0%,_#666666_100%)]',
            showShadow && 'shadow-[0px_4px_14px_0px_#FF6A2A]',
            disabled && disabledGrayType && 'bg-none bg-transparent',
            innerClassName,
          )}
        >
          <div
            className={twMerge(
              'w-full p-[3px] bg-[linear-gradient(180deg,_#FFA527_0%,_#DD2929_100%)] rounded-full',
              disabled && disabledGrayType && 'bg-none bg-gray-600',
            )}
          >
            <div
              className={twMerge(
                'flex justify-center rounded-full py-4 bg-[radial-gradient(47.97%_93.44%_at_49.86%_6.56%,_#FF8228_0%,_#F05804_100%)]',
                disabled && disabledGrayType && 'bg-none bg-gray-700 text-gray-350',
                contentClassName,
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </button>
    </>
  );
};
