import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  wrapperClassName?: string;
  innerClassName?: string;
  btnClassName?: string;
}

export const ButtonBlue = ({
  children,
  className,
  wrapperClassName,
  innerClassName,
  btnClassName,
  disabled,
  ...props
}: Props & ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <>
      <button
        className={twMerge(
          'group block cursor-pointer border border-black/25 rounded-full p-[5px] hover:opacity-90 disabled:cursor-not-allowed',
          wrapperClassName,
        )}
        disabled={disabled}
        {...props}
      >
        <div
          className={twMerge(
            'flex relative rounded-full items-center',
            'shadow-[0px_4px_14px_0px_#2791FC66] hover:shadow-lg hover:shadow-blue-500/10',
            innerClassName,
          )}
        >
          <div
            className={twMerge(
              'p-[3px] rounded-full bg-[linear-gradient(180deg,_#69DAFF_0%,_#1E65FF_100%)]',
              disabled && 'bg-gray-600 bg-none',
              btnClassName,
            )}
          >
            <div
              className={twMerge(
                'px-[21px] py-[7px] rounded-full bg-[radial-gradient(52.05%_98.21%_at_50%_1.79%,_#28C9FF_0%,_#2791FC_100%)]',
                disabled && 'bg-gray-700 bg-none text-gray-350',
                className,
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
