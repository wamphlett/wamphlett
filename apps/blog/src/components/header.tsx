'use client';
import React, { useEffect, useState } from 'react';
import styles from './header.module.css';
import { FlickrLogo, GithubIcon, InstaLogo } from '@/components/svgs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import FancyMenuIcon from './fancyMenuIcon';

type HeaderProps = {
  position?: number;
  menuRef?: React.RefObject<HTMLDivElement | null>;
  onMenuClick?: () => void;
  menuIcon?: boolean;
};

export default function Header({
  position = 24,
  menuRef,
  onMenuClick,
  menuIcon = false,
}: HeaderProps) {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Calculate the percentage of how far we've scrolled relative to the viewport height
      const percentageScrolled = Math.min(
        (scrollPosition / (windowHeight / 2)) * 100,
        100,
      ); // capped at 100%
      setScrollPercentage(percentageScrolled);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      // Cleanup - remove the listener when the component unmounts
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const blurAmount = 4 * (scrollPercentage / 100); // Max blur of 3px

  return (
    <div>
      <div
        className={`flex flex-column content-between ${styles.container}`}
        style={{
          height: 100,
          left: position,
          top: position,
          right: position,
          backgroundColor: `rgba(0, 0, 0, ${0.2 * (scrollPercentage / 100)})`,
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
        }}
      >
        <div className={`flex flex-row ${styles.social}`}>
          <div className={styles.icon}>
            <Link
              href="https://www.instagram.com/warrenamphlett/"
              passHref
              target="_blank"
            >
              <InstaLogo />
            </Link>
          </div>
          {/* <div className={styles.icon}>
            <Link
              href="https://lightroom.adobe.com/u/warrenamphlett"
              passHref
              target="_blank"
            >
              <LightroomLogo />
            </Link>
          </div> */}
          <div className={styles.icon}>
            <Link
              href="https://www.flickr.com/photos/199526751@N07/"
              passHref
              target="_blank"
            >
              <FlickrLogo />
            </Link>
          </div>
          <div className={styles.icon}>
            <Link href="https://github.com/wamphlett/" passHref target="_blank">
              <GithubIcon />
            </Link>
          </div>
        </div>

        <h1 className={styles.title}>
          <Link
            href={
              usePathname() == '/'
                ? (process.env.NEXT_PUBLIC_HOME_SITE_URL ??
                  'https://warrenamphlett.co.uk')
                : '/'
            }
          >
            Warren Amphlett<span>.</span>
          </Link>
        </h1>

        <div className={styles.links}>
          <Link
            href={
              process.env.NEXT_PUBLIC_PHOTOS_SITE_URL ??
              'https://photos.warrenamphlett.co.uk'
            }
          >
            Photos
          </Link>
          <div onClick={onMenuClick} ref={menuRef}>
            <FancyMenuIcon open={menuIcon} />
          </div>
        </div>
      </div>
    </div>
  );
}
