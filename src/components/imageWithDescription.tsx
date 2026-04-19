import React, { useState, useEffect } from 'react';
import AspectRatioBox from './aspectRatioBox';
import LazyImage from './lazyimage';
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
  let styles = { padding: padding, minWidth: minWidth, width: width };
  if (width) {
    styles.width = width;
  }

  const blurDataURL = await getBlurUrl(url);

  return (
    <div className="flex-grow" style={styles}>
      <AspectRatioBox aspectRatio={aspectRatio}>
        <LazyImage
          url={url}
          backgroundColor="lightgray"
          blurDataURL={blurDataURL}
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
