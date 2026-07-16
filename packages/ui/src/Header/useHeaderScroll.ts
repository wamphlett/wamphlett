'use client';

import { useEffect, useState } from 'react';

type HeaderScroll = {
  blurAmount: number;
  backgroundOpacity: number;
  namePosition: number | undefined;
};

export function useHeaderScroll(scrollIn: boolean): HeaderScroll {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setWindowHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const percentageScrolled = Math.min(
    (scrollY / (windowHeight / 2)) * 100,
    100,
  );
  const blurAmount = 4 * (percentageScrolled / 100);
  const backgroundOpacity = 0.2 * (percentageScrolled / 100);

  let namePosition: number | undefined;
  if (scrollIn) {
    const startTransition = 0.5 * windowHeight;
    const endTransition = 0.9 * windowHeight;

    if (scrollY <= startTransition) {
      namePosition = 100;
    } else if (scrollY >= endTransition) {
      namePosition = 0;
    } else {
      const transitionRange = endTransition - startTransition;
      const scrollProgress = scrollY - startTransition;
      namePosition = 100 - (scrollProgress / transitionRange) * 100;
    }
  }

  return { blurAmount, backgroundOpacity, namePosition };
}
