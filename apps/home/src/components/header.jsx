'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { FlickrLogo, InstaLogo } from '@/components/svgs';

import styles from './header.module.css';

export default function Header({ position = 24 }) {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    handleResize();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startTransition = 0.5 * windowHeight; // 80vh
  const endTransition = 0.9 * windowHeight; // 110vh

  let namePosition;
  if (scrollY <= startTransition) {
    namePosition = 100;
  } else if (scrollY >= endTransition) {
    namePosition = 0;
  } else {
    const transitionRange = endTransition - startTransition;
    const scrollProgress = scrollY - startTransition;
    namePosition = 100 - (scrollProgress / transitionRange) * 100;
  }

  const handleClick = event => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div>
      <div
        className={`flex flex-column content-between ${styles.container}`}
        style={{
          height: 100,
          left: position,
          top: position,
          right: position,
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
            <Link href="https://lightroom.adobe.com/u/warrenamphlett" passHref target="_blank">
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
        </div>

        <h1 className={styles.title} style={{ top: -namePosition }}>
          <Link href="/" onClick={handleClick} passHref>
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
          <Link
            href={
              process.env.NEXT_PUBLIC_BLOG_SITE_URL ??
              'https://blog.warrenamphlett.co.uk'
            }
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
