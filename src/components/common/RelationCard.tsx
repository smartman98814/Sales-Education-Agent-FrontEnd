import { motion } from 'framer-motion';
import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  blueCard?: boolean;
  delay?: number;
  duration?: number;
}

export const RelationCard = ({
  blueCard = true,
  delay = 0,
  duration = 0.2,
  children,
}: Props & HTMLAttributes<HTMLDivElement>) => {
  return (
    <motion.div
      className="w-full flex justify-center"
      initial={{ opacity: 0, x: 0 }}
      whileInView={{ opacity: 1, x: [0, -4, 0, 4, 0] }}
      viewport={{ once: true }}
      transition={{ delay, duration }}
    >
      <div
        className={twMerge(
          'w-max p-px rounded-full z-20',
          blueCard &&
            'bg-[linear-gradient(90deg,_#2791FC_0%,_#28C9FF_100%)] shadow-[0px_4px_7px_0px_#2791FC47]',
          !blueCard && 'bg-white shadow-[0px_3px_6px_0px_#00000014]',
        )}
      >
        <div
          className={twMerge(
            'flex items-center gap-1 p-2 rounded-full font-grotesk text-black dark:text-white text-sm font-medium uppercase',
            blueCard && 'bg-[#f7f7f7] dark:bg-gray-900',
            !blueCard && 'bg-[#e7e7e7] dark:bg-gray-900',
          )}
        >
          <i
            className={twMerge('w-2 h-2', blueCard && 'bg-blue-500', !blueCard && 'bg-orange-500')}
          />
          {children}
        </div>
      </div>
    </motion.div>
  );
};
