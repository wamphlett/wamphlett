import { CSSProperties } from 'react';
import { AspectRatioBox, LazyImage } from '@wamphlett/ui';

import styles from './albumTile.module.css';
import Link from 'next/link';
import { Album } from '@/app/types';
import { getBlurUrl } from '@/app/loaders';

type AlbumTileProps = {
  album: Album;
  maxWidth?: CSSProperties['maxWidth'];
  backgroundColor?: string;
};

export default async function AlbumTile({
  album,
  maxWidth = '100%',
  backgroundColor = 'black',
}: AlbumTileProps) {
  const blurDataURL = await getBlurUrl(album.tileImageUrl);
  return (
    <div className={styles.tile} style={{ maxWidth: maxWidth }}>
      <Link href={album.url}>
        <AspectRatioBox aspectRatio={1}>
          <LazyImage
            backgroundColor={backgroundColor}
            blurDataURL={blurDataURL}
            opacity={0.3}
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
