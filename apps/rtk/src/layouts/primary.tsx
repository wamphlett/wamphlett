'use client';
import React, { useEffect, useState } from 'react';
import HeaderVideo from '@/components/headerVideo';
// import HeaderVideo from '@/components/videoBackground';
import Header from '@/components/header';
import styles from './layouts.module.css';
import DimmingBackground from '@/components/dimmingBackground';

type PrimaryLayoutProps = {
  headerImageUrl: string;
  headerImageBlurDataURL: string;
  children?: React.ReactNode;
};

export default function PrimaryLayout({
  children,
  headerImageUrl,
  headerImageBlurDataURL,
}: PrimaryLayoutProps) {
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

        {/* <HeaderImage
          url={headerImageUrl}
          blurDataURL={headerImageBlurDataURL}
          padding={padding}
        /> */}
        <HeaderVideo padding={padding} url="/background.mp4" />
        <div
          className={`relative ${styles.defaultWidth}`}
          style={{ zIndex: 20, paddingBottom: 50 }}
        >
          {children}
        </div>
      </DimmingBackground>
    </div>
  );
}
