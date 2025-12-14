import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { NotificationIcon } from '@/components/svg';

interface Props {
  hasNotifications?: boolean;
  iconClassName?: string;
}

export const NotificationBtn = ({
  hasNotifications,
  className,
  iconClassName,
  ...props
}: Props & HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={twMerge('relative cursor-pointer', className)} {...props}>
      <NotificationIcon className="text-white" />
      {hasNotifications && (
        <div className="absolute w-3 h-3 bg-orange-500 rounded-full -top-0.5 -right-0.5 border-2 border-black-light box-content" />
      )}
    </button>
  );
};
