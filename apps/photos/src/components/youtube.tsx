import React from 'react';
import { AspectRatioBox } from '@wamphlett/ui';

import styles from './youtube.module.css';

type YouTubeProps = {
  link: string;
};

export default function YouTube({ link }: YouTubeProps) {
  return (
    <div className={styles.container}>
      <AspectRatioBox aspectRatio={16 / 9}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
          height="1080"
          src={link}
          title="YouTube video player"
          width="1920"
        ></iframe>
      </AspectRatioBox>
    </div>
  );
}
