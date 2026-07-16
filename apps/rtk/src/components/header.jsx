'use client';
import React from 'react';
import { Header } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

const socialLinks = [
  { name: 'instagram', href: 'https://www.instagram.com/warrenamphlett/' },
  { name: 'flickr', href: 'https://www.flickr.com/photos/199526751@N07/' },
  { name: 'github', href: 'https://github.com/wamphlett/' },
];

export default function RtkHeader({ position = 24 }) {
  const { homeSiteUrl, photosSiteUrl, blogSiteUrl } = useRuntimeConfig();

  return (
    <Header
      navLinks={[
        { name: 'Photos', link: photosSiteUrl ?? 'https://photos.warrenamphlett.co.uk' },
        { name: 'Blog', link: blogSiteUrl ?? 'https://blog.warrenamphlett.co.uk' },
      ]}
      nameHref={homeSiteUrl ?? 'https://warrenamphlett.co.uk'}
      position={position}
      scrollIn
      socialLinks={socialLinks}
    />
  );
}
