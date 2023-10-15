'use client';
import React, { useEffect, useRef, useState } from 'react';
import HeaderImage from '@/components/headerimage';
import Header from '@/components/header';

import styles from './layouts.module.css';

type PrimaryLayoutProps = {
  headerImageUrl: string;
  headerImageBlurDataURL: string;
  children?: React.ReactNode;
  sidebar: React.ReactNode;
};

export default function PrimaryLayout({
  children,
  headerImageUrl,
  headerImageBlurDataURL,
  sidebar,
}: PrimaryLayoutProps) {
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    setMaxScroll(window.innerHeight * 0.3);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      // If the menu is open and the click was outside the menu, close it
      if (open && menuRef.current) {
        // Check if event.target is a Node
        if (
          !(event.target instanceof Node) ||
          !menuRef.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  let padding = 24 - 24 * (scrollY / maxScroll);
  if (padding < 0) {
    padding = 0;
  }

  return (
    <div className="relative">
      <Header
        menuIcon={open}
        menuRef={menuRef}
        onMenuClick={() => setOpen(!open)}
        position={padding}
      />

      <HeaderImage
        blurDataURL={headerImageBlurDataURL}
        padding={padding}
        url={headerImageUrl}
      />

      <div
        className={`relative ${styles.page} ${styles.defaultWidth}`}
        style={{ zIndex: 20, paddingBottom: 50 }}
      >
        <div className={styles.content}>{children}</div>
        <div className={`${styles.sidebar} ${open ? styles.open : ''}`}>
          {sidebar}
        </div>
      </div>
    </div>
  );
}
