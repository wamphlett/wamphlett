'use client'
import React, { useState, useEffect } from 'react';

export default function DimmingBackground({ children }) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
  
      // Calculate the percentage of how far we've scrolled relative to the viewport height
      const percentageScrolled = Math.min((scrollPosition / windowHeight *1.5) * 100, 100); // capped at 100%
      setScrollPercentage(percentageScrolled);
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const bgColor = `rgb(
    ${255 - (2.43 * scrollPercentage)},
    ${255 - (2.43 * scrollPercentage)},
    ${255 - (2.43 * scrollPercentage)}
  )`;
  
  return (
    <div style={{ backgroundColor: bgColor }}>
      {children}
    </div>
  );
}