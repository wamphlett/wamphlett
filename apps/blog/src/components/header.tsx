'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { Header, type SocialLink } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import FancyMenuIcon from './fancyMenuIcon';
import styles from './header.module.css';

const socialLinks: SocialLink[] = [
  { name: 'instagram', href: 'https://www.instagram.com/warrenamphlett/' },
  { name: 'flickr', href: 'https://www.flickr.com/photos/199526751@N07/' },
  { name: 'github', href: 'https://github.com/wamphlett/' },
];

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
  const pathname = usePathname();
  const { homeSiteUrl, photosSiteUrl } = useRuntimeConfig();

  return (
    <Header
      className={styles.header}
      nameHref={
        pathname === '/' ? (homeSiteUrl ?? 'https://warrenamphlett.co.uk') : '/'
      }
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
