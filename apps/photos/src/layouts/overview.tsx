'use client';
import React, { useEffect, useState } from 'react';

import HeaderImage from '@/components/headerimage';
import Header from '@/components/header';
import GalleryTitle from '@/components/gallerytitle';
import DimmingBackground from '@/components/dimmingBackground';

import styles from './layouts.module.css';

type OverviewLayoutProps = {
  children: React.ReactNode;
  headerImageUrl: string;
  headerImageBlurDataURL: string;
  title: string;
  description: string;
};

export default function OverviewLayout({
  children,
  headerImageUrl,
  headerImageBlurDataURL,
  title,
  description,
}: OverviewLayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);
  const [defaultPadding, setDefaultPadding] = useState(24);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setDefaultPadding(window.innerWidth < 768 ? 10 : 24);
      setMaxScroll(window.innerHeight * 0.8);
    };

    handleResize();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let padding = defaultPadding - defaultPadding * (scrollY / maxScroll);
  if (padding < 0) {
    padding = 0;
  }

  return (
    <div className="relative">
      <DimmingBackground>
        <Header position={padding} />

        <HeaderImage
          blurDataURL={headerImageBlurDataURL}
          padding={padding}
          url={headerImageUrl}
        />

        <div
          className={`relative ${styles.defaultWidth}`}
          style={{ zIndex: 20, paddingBottom: 50 }}
        >
          <GalleryTitle
            description={description}
            expandOnMobile={false}
            primary={title}
            smaller
          />

          <div className={styles.albums}>{children}</div>
        </div>
      </DimmingBackground>
    </div>
  );
}
