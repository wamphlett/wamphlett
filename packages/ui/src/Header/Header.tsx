'use client';

import type { MouseEvent, ReactNode } from 'react';
import Link from 'next/link';

import { socialIconRegistry } from '../icons/registry';
import { useHeaderScroll } from './useHeaderScroll';
import type { NavLink, SocialLink } from './types';
import styles from './Header.module.css';

export type HeaderProps = {
  siteName?: string;
  nameHref: string;
  onNameClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  scrollIn?: boolean;
  socialLinks?: SocialLink[];
  navLinks?: NavLink[];
  menuSlot?: ReactNode;
  /** Hide menuSlot above 850px, showing it only at mobile widths -- for
   * apps where the menu is redundant at desktop because its content has a
   * permanent, always-visible desktop layout elsewhere on the page. */
  collapseMenuOnDesktop?: boolean;
  position?: number;
  className?: string;
};

export default function Header({
  siteName = 'Warren Amphlett',
  nameHref,
  onNameClick,
  scrollIn = false,
  socialLinks = [],
  navLinks = [],
  menuSlot,
  collapseMenuOnDesktop = false,
  position = 24,
  className,
}: HeaderProps) {
  const { blurAmount, backgroundOpacity, namePosition } =
    useHeaderScroll(scrollIn);

  return (
    <div
      className={`${styles.container} ${className ?? ''}`}
      style={{
        height: 100,
        left: position,
        top: position,
        right: position,
        backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity})`,
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      }}
    >
      {socialLinks.length > 0 && (
        <div className={styles.social}>
          {socialLinks.map(social => {
            const Icon = socialIconRegistry[social.name];
            return (
              <div className={styles.icon} key={social.name}>
                <Link href={social.href} passHref target="_blank">
                  <Icon />
                </Link>
              </div>
            );
          })}
        </div>
      )}

      <h1 className={styles.title} style={{ top: namePosition !== undefined ? -namePosition : undefined }}>
        <Link href={nameHref} onClick={onNameClick} passHref>
          {siteName}
          <span>.</span>
        </Link>
      </h1>

      <div
        className={`${styles.links} ${collapseMenuOnDesktop && menuSlot ? styles.linksCollapsible : ''}`}
      >
        {navLinks.map(navLink => (
          <Link href={navLink.link} key={navLink.name}>
            {navLink.name}
          </Link>
        ))}
        {menuSlot}
      </div>
    </div>
  );
}
