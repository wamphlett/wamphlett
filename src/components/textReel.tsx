'use client';
import React, { useState, useEffect } from 'react';

import './textReel.css';

type TextReelProps = {
  children: React.ReactNode[];
};

export default function TextReel({ children }: TextReelProps) {
  const [index, setIndex] = useState(0);
  const [show, setShow] = useState(true); // Controls fadeIn/fadeOut

  useEffect(() => {
    // Timer to switch text
    const switchTextInterval = setInterval(() => {
      setShow(false); // Start fade out

      // After fade out, switch text and start fade in
      const timeout = setTimeout(() => {
        setIndex(prevIndex => (prevIndex + 1) % children.length);
        setShow(true);
      }, 400);

      return () => clearTimeout(timeout);
    }, 3000);

    return () => clearInterval(switchTextInterval);
  }, [children.length]);

  const className = show ? 'text-reel-fade-in' : 'text-reel-fade-out';

  return <div className={`text-reel ${className}`}>{children[index]}</div>;
}
