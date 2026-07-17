'use client';
import React, { useEffect, useRef, useState } from 'react';
import { FancyMenuIcon, Header, headerSocialLinks } from '@wamphlett/ui';

import Sidebar from './sidebar';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

export default function PhotosHeader({ position = 24 }) {
  const [open, setOpen] = useState(false);
  const { homeSiteUrl, blogSiteUrl } = useRuntimeConfig();

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
          <div
            className="relative"
            onClick={() => setOpen(!open)}
            ref={menuRef}
          >
            <FancyMenuIcon open={open} />
          </div>
        }
        nameHref={homeSiteUrl ?? 'https://warrenamphlett.co.uk'}
        navLinks={[
          {
            name: 'Blog',
            link: blogSiteUrl ?? 'https://blog.warrenamphlett.co.uk',
          },
        ]}
        position={position}
        socialLinks={headerSocialLinks}
      />

      <Sidebar open={open} />
    </div>
  );
}
