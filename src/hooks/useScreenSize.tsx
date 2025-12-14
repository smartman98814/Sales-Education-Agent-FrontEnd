'use client';

import { useScroll } from 'framer-motion';
import _ from 'lodash';
import { useEffect, useState } from 'react';

export function useScreenSize(scrollDelay = 200) {
  const [height, setHeight] = useState(0);
  const { scrollY } = useScroll();
  const [yPos, setYPos] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [yDirection, setYDirection] = useState<'down' | 'up' | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };
    updateHeight(); // set initial height

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // For scroll event
  useEffect(() => {
    const handleScroll = _.debounce((latest: number) => {
      setYDirection(latest > yPos ? 'down' : 'up');
      setYPos(latest);
    }, scrollDelay); // Wait scrollDelay[ms] after last scroll event

    const unsubscribe = scrollY.on('change', handleScroll);

    return () => {
      handleScroll.cancel();
      unsubscribe();
    };
  }, [yPos, scrollY]);

  return {
    isMobile: isMobile,
    screenHeight: height,
    scrollY: yPos,
    scrollYDirection: yDirection,
  };
}
