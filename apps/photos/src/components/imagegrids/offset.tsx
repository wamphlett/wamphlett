import ImageWithDescription from '@/components/imageWithDescription';
import { GalleryImage } from '@/app/types';

import styles from './grids.module.css';

export enum Type {
  Default = 'default',
  Tall = 'tall',
}

type DoubleProps = {
  images: GalleryImage[];
  inverted?: boolean;
  type?: Type;
};

export default function Offset({
  images,
  inverted = false,
  type = Type.Default,
}: DoubleProps) {
  return (
    <div
      className={
        'flex flex-wrap ' +
        (inverted ? 'flex-row-reverse' : 'flex-row') +
        ` ${styles.grid} ${styles.offset} ${styles[type]}`
      }
    >
      <ImageWithDescription
        aspectRatio={type == Type.Default ? 16 / 13.6 : 2 / 3}
        description={images[0].description}
        title={images[0].title}
        url={images[0].url}
      />

      <ImageWithDescription
        aspectRatio={type == Type.Default ? 16 / 9 : 5 / 4}
        description={images[1].description}
        title={images[1].title}
        url={images[1].url}
      />
    </div>
  );
}
