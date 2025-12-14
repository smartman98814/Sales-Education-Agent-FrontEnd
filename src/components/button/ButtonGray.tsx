import React, { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export const ButtonGray = ({
  children,
  containerClassName,
  className,
  ...props
}: { containerClassName?: string } & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <>
      <button
        className={twMerge(
          'flex relative rounded-full items-center border-2 border-gray-400 dark:border-gray-500',
          containerClassName,
        )}
        {...props}
      >
        <div className="w-full p-[3px] rounded-full bg-[linear-gradient(180deg,_#D9D9D9_0%,_#ADADAD_100%)] dark:bg-[linear-gradient(180deg,_#262626_0%,_#525252_100%)]">
          <div
            className={twMerge(
              'px-4 py-[7px] rounded-full bg-gray-50 dark:bg-gray-900 flex justify-center',
              className,
            )}
          >
            {children}
          </div>
        </div>
      </button>
    </>
  );
};
