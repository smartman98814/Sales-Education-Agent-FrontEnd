'use client';

import { HTMLAttributes, useEffect } from 'react';
import { useScramble } from 'use-scramble';

interface Props {
  text: string;
  show?: boolean;
}
export const ScrambleTextItem = ({
  text,
  show = true,
  className,
}: Props & HTMLAttributes<HTMLDivElement>) => {
  const { ref: ref, replay } = useScramble({
    speed: 0.6,
    text,
    tick: 1,
    step: 1,
    scramble: 4,
    seed: 0,
  });

  useEffect(() => {
    if (!show) {
      return;
    }

    replay();
  }, [show]);

  if (!show) {
    return null;
  }

  return <div ref={ref} className={className} />;
};
