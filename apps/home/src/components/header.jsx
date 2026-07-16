'use client';
import React from 'react';
import { Header } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

const socialLinks = [
  { name: 'instagram', href: 'https://www.instagram.com/warrenamphlett/' },
  { name: 'flickr', href: 'https://www.flickr.com/photos/199526751@N07/' },
];

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
