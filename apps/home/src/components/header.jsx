'use client';
import React from 'react';
import { Header, socialLinks } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

export default function HomeHeader({ position = 24 }) {
  const { photosSiteUrl, blogSiteUrl } = useRuntimeConfig();

  const handleNameClick = event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Header
      navLinks={[
        { name: 'Photos', link: photosSiteUrl ?? 'https://photos.warrenamphlett.co.uk' },
        { name: 'Blog', link: blogSiteUrl ?? 'https://blog.warrenamphlett.co.uk' },
      ]}
      nameHref="/"
      onNameClick={handleNameClick}
      position={position}
      scrollIn
      socialLinks={socialLinks}
    />
  );
}
