'use client';
import React from 'react';
import { Header, headerSocialLinks } from '@wamphlett/ui';

import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';

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
      socialLinks={headerSocialLinks}
    />
  );
}
