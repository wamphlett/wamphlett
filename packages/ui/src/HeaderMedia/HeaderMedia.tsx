import type { CSSProperties, ReactNode } from 'react';

import styles from './HeaderMedia.module.css';

export type HeaderMediaProps = {
  padding?: number;
  /** Desktop height, e.g. '100vh'. */
  height?: string;
  /** Height at <=850px; falls back to `height` if omitted. */
  tabletHeight?: string;
  /** Height at <=480px; falls back to `tabletHeight`, then `height`, if omitted. */
  mobileHeight?: string;
  mediaSlot: ReactNode;
};

export default function HeaderMedia({
  padding = 24,
  height = '100vh',
  tabletHeight,
  mobileHeight,
  mediaSlot,
}: HeaderMediaProps) {
  return (
    <div
      className={styles.container}
      style={
        {
          padding,
          '--header-media-height': height,
          ...(tabletHeight
            ? { '--header-media-tablet-height': tabletHeight }
            : {}),
          ...(mobileHeight
            ? { '--header-media-mobile-height': mobileHeight }
            : {}),
        } as CSSProperties
      }
    >
      <div className={styles.mediaWrapper}>{mediaSlot}</div>
    </div>
  );
}
