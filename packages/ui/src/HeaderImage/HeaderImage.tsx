import type { CSSProperties } from 'react';

import LazyImage from '../LazyImage/LazyImage';
import styles from './HeaderImage.module.css';

export type HeaderImageProps = {
  padding?: number;
  url: string;
  blurDataURL: string;
  /** Desktop height, e.g. '100vh'. */
  height?: string;
  /** Height at <=850px; falls back to `height` if omitted. */
  tabletHeight?: string;
  /** Height at <=480px; falls back to `tabletHeight`, then `height`, if omitted. */
  mobileHeight?: string;
};

export default function HeaderImage({
  url,
  blurDataURL,
  padding = 24,
  height = '100vh',
  tabletHeight,
  mobileHeight,
}: HeaderImageProps) {
  return (
    <div
      className={styles.container}
      style={
        {
          padding,
          '--header-image-height': height,
          ...(tabletHeight
            ? { '--header-image-tablet-height': tabletHeight }
            : {}),
          ...(mobileHeight
            ? { '--header-image-mobile-height': mobileHeight }
            : {}),
        } as CSSProperties
      }
    >
      <div className={styles.imageWrapper}>
        <LazyImage
          blurDataURL={blurDataURL}
          borderRadius={0}
          opacity={0.5}
          priority={true}
          url={url}
        />
      </div>
    </div>
  );
}
