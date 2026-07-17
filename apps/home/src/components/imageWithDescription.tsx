import React from 'react';
import { AspectRatioBox, LazyImage } from '@wamphlett/ui';
import styles from './imageWithDescription.module.css';
import { getBlurUrl } from '@/app/loaders';

type ImageWithDescriptionProps = {
  url: string;
  title?: string;
  description?: string;
  aspectRatio?: number;
  minWidth?: number;
  padding?: number;
  width?: string;
};

export default async function ImageWithDescription({
  url,
  title,
  description,
  aspectRatio = 1,
  minWidth = 200,
  padding = 5,
  width,
}: ImageWithDescriptionProps) {
  const styles = { padding: padding, minWidth: minWidth, width: width };
  if (width) {
    styles.width = width;
  }

  const blurDataURL = await getBlurUrl(url);

  return (
    <div className="flex-grow" style={styles}>
      <AspectRatioBox aspectRatio={aspectRatio}>
        <LazyImage
          backgroundColor="lightgray"
          blurDataURL={blurDataURL}
          url={url}
        />
        {(title || description) && overlay(title!, description)}
      </AspectRatioBox>
    </div>
  );
}

const overlay = (title: string, description?: string) => (
  <div className={styles.overlay}>
    <div className={styles.content}>
      <span>{title}</span>
      {description && <p>{description}</p>}
      <div className={styles.background}></div>
    </div>
  </div>
);
