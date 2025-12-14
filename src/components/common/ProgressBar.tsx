import * as Progress from '@radix-ui/react-progress';
import numeral from 'numeral';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  label?: string;
  labelClassName?: string;
  percentage: number;
  className?: string;
  wrapperClassName?: string;
  indicatorClassName?: string;
}

export const ProgressBar = ({
  label,
  labelClassName,
  percentage,
  className,
  wrapperClassName,
  indicatorClassName,
}: ProgressBarProps) => {
  return (
    <div className={twMerge(wrapperClassName)}>
      {label && (
        <div
          className={twMerge(
            'flex justify-between gap-2 text-gray-350 text-sm mb-2',
            labelClassName,
          )}
        >
          <span>{label}</span>
          <span>{numeral(percentage).format('0')}%</span>
        </div>
      )}
      <Progress.Root
        className={twMerge(
          'relative h-1.5 w-full overflow-hidden rounded-full bg-black-light border border-gray-700',
          className,
        )}
        value={percentage}
      >
        <Progress.Indicator
          className={twMerge(
            'h-full w-full flex-1 bg-blue-500 transition-transform duration-300',
            indicatorClassName,
          )}
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </Progress.Root>
    </div>
  );
};
