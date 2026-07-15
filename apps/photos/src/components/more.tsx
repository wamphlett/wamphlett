import { AlbumData } from '@/app/types';
import AlbumTile from './albumTile';

import styles from './more.module.css';

type Tiles = AlbumData[];

interface MoreProps {
  tiles: Tiles;
}

export default function More({ tiles }: MoreProps) {
  return (
    <div className={styles.more}>
      <span>More Albums</span>

      <div className={styles.tiles}>
        {tiles.map((details, index) =>
          details ? (
            <AlbumTile album={details} key={index} maxWidth={200} />
          ) : (
            <div key={index} />
          ),
        )}
      </div>
    </div>
  );
}
