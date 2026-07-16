'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from '@wamphlett/ui';

import FancyMenuIcon from '@/components/fancyMenuIcon';
import Sidebar from './sidebar';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

const socialLinks = [
  { name: 'instagram', href: 'https://www.instagram.com/warrenamphlett/' },
  { name: 'flickr', href: 'https://www.flickr.com/photos/199526751@N07/' },
];

export default function PhotosHeader({ position = 24 }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { homeSiteUrl } = useRuntimeConfig();

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  return (
    <div>
      <Header
        menuSlot={
          <div className="relative" onClick={() => setOpen(!open)} ref={menuRef}>
            <FancyMenuIcon open={open} />
          </div>
        }
        nameHref={
          pathname === '/' ? (homeSiteUrl ?? 'https://warrenamphlett.co.uk') : '/'
        }
        position={position}
        socialLinks={socialLinks}
      />

      <Sidebar open={open} />
    </div>
  );
}
