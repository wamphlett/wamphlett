'use client';
import React from 'react';
import { Header, socialLinks } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import FancyMenuIcon from './fancyMenuIcon';
import styles from './header.module.css';

type HeaderProps = {
  position?: number;
  menuRef?: React.RefObject<HTMLDivElement | null>;
  onMenuClick?: () => void;
  menuIcon?: boolean;
};

export default function BlogHeader({
  position = 24,
  menuRef,
  onMenuClick,
  menuIcon = false,
}: HeaderProps) {
  const { homeSiteUrl, photosSiteUrl } = useRuntimeConfig();

  return (
    <Header
      className={styles.header}
      collapseMenuOnDesktop
      nameHref={homeSiteUrl ?? 'https://warrenamphlett.co.uk'}
      navLinks={[
        { name: 'Photos', link: photosSiteUrl ?? 'https://photos.warrenamphlett.co.uk' },
      ]}
      menuSlot={
        <div onClick={onMenuClick} ref={menuRef}>
          <FancyMenuIcon open={menuIcon} />
        </div>
      }
      position={position}
      socialLinks={socialLinks}
    />
  );
}
