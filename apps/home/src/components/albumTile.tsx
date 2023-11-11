import AspectRatioBox from './aspectRatioBox';
import LazyImage from './lazyimage';

import styles from './albumTile.module.css';
import Link from 'next/link';
import { Album } from '@/app/types';
import { getBlurUrl } from '@/app/loaders';

type AlbumTileProps = {
  album: Album;
  maxWidth?: any;
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
            url={album.tileImageUrl}
            blurDataURL={blurDataURL}
            opacity={0.3}
            backgroundColor={backgroundColor}
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
