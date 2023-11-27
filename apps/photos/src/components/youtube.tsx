import React from 'react';
import AspectRatioBox from './aspectRatioBox';

import styles from './youtube.module.css';

type YouTubeProps = {
  link: string;
};

export default function YouTube({ link }: YouTubeProps) {
  return (
    <div className={styles.container}>
      <AspectRatioBox aspectRatio={16 / 9}>
        <iframe
          width="1920"
          height="1080"
          src={link}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </AspectRatioBox>
    </div>
  );
}
