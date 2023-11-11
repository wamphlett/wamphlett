import { Album } from '@/app/types';
import styles from './more.module.css';
import AlbumTile from './albumTile';

type Tiles = [Album, Album, Album];

interface MoreProps {
  tiles: Tiles;
}

export default function More({ tiles }: MoreProps) {
  return (
    <div className={styles.more}>
      <span>See more photos</span>

      <div className={styles.tiles}>
        {tiles.map((details, index) =>
          details ? (
            <AlbumTile key={index} album={details} maxWidth={200} />
          ) : (
            <div key={index} />
          ),
        )}
      </div>
    </div>
  );
}
