'use client';
import React, { useEffect, useState } from 'react';

export type DimmingBackgroundProps = {
  children: React.ReactNode;
  scrollMultiplier?: number;
};

export default function DimmingBackground({
  children,
  scrollMultiplier = 1,
}: DimmingBackgroundProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate the percentage of how far we've scrolled relative to the viewport height
      const percentageScrolled = Math.min(
        (scrollPosition / windowHeight) * scrollMultiplier * 100,
        100,
      ); // capped at 100%
      setScrollPercentage(percentageScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrollMultiplier]);

  const bgColor = `rgb(
    ${255 - 2.43 * scrollPercentage},
    ${255 - 2.43 * scrollPercentage},
    ${255 - 2.43 * scrollPercentage}
  )`;

  return <div style={{ backgroundColor: bgColor }}>{children}</div>;
}
