import { CSSProperties } from 'react';
import Link from 'next/link';

import { AlbumData } from '@/app/types';
import { getBlurUrl } from '@/app/loaders';

import AspectRatioBox from './aspectRatioBox';
import LazyImage from './lazyimage';

import styles from './albumTile.module.css';

export enum AlbumTileStyle {
  Small = 'small',
  Large = 'large',
}

type AlbumTileProps = {
  album: AlbumData;
  maxWidth?: CSSProperties['maxWidth'];
  backgroundColor?: string;
  type?: AlbumTileStyle;
};

export default async function AlbumTile({
  album,
  maxWidth = '100%',
  backgroundColor = 'black',
  type = AlbumTileStyle.Small,
}: AlbumTileProps) {
  const blurDataURL = await getBlurUrl(album.tileImageUrl);
  return (
    <div
      className={`${styles.tile} ${styles[type]}`}
      style={{ maxWidth: maxWidth }}
    >
      <Link href={album.url}>
        <AspectRatioBox aspectRatio={1}>
          <LazyImage
            backgroundColor={backgroundColor}
            blurDataURL={blurDataURL}
            opacity={AlbumTileStyle.Large == type ? 1 : 0.3}
            url={album.tileImageUrl}
          />
          <div className={styles.title}>
            <span>{album.title}</span>
            <span>{album.year}</span>
          </div>
        </AspectRatioBox>
      </Link>
    </div>
  );
}
