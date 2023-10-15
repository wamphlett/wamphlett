'use client';
import path from 'path';
import React, { useEffect, useRef, useState } from 'react';
import styles from './lazyimage.module.css';
import Image from 'next/image';

type LazyImageProps = {
  url: string;
  opacity?: number;
  borderRadius?: number;
  backgroundColor?: string;
  blurDataURL?: string;
  priority?: boolean;
};

type imageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

const imageLoaderBuilder = (componentWidth: number) => {
  return ({ src, width }: imageLoaderProps) => {
    if (componentWidth == 0) {
      width = 640;
    }

    if ([640, 1080, 1200, 1920, 2048, 3840].indexOf(width) == -1) {
      width = 640;
    }

    const directory = path.dirname(src);
    const fileName = path.basename(src);

    return `${directory}/${width}/${fileName}`;
  };
};

export default function LazyImage({
  url,
  opacity = 1,
  borderRadius = 5,
  backgroundColor = '#000',
  blurDataURL = '',
  priority = false,
}: LazyImageProps) {
  const [loaded, setLoaded] = useState(false);

  const myComponentRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (myComponentRef.current) {
      setWidth(myComponentRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (myComponentRef.current) {
        setWidth(myComponentRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className={styles.container}
      ref={myComponentRef}
      style={{ borderRadius: borderRadius, backgroundColor: backgroundColor }}
    >
      <div
        className={styles.image}
        style={{
          opacity: loaded ? opacity : 0,
          transform: loaded ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        <Image
          alt=""
          height={width}
          loader={imageLoaderBuilder(width)}
          onLoadingComplete={() => setLoaded(true)}
          priority={priority}
          src={url}
          width={width}
        />
      </div>
      <div
        className={styles.blur}
        style={{
          opacity: loaded ? 0 : opacity,
          transform: loaded ? 'scale(1)' : 'scale(1.1)',
        }}
      >
        <Image alt="" height={width} src={blurDataURL} width={width} />
      </div>
    </div>
  );
}
