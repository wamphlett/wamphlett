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
        `flex flex-wrap ` +
        (inverted ? `flex-row-reverse` : `flex-row`) +
        ` ${styles.grid} ${styles.offset} ${styles[type]}`
      }
    >
      <ImageWithDescription
        url={images[0].url}
        title={images[0].title}
        description={images[0].description}
        aspectRatio={type == Type.Default ? 16 / 13.6 : 2 / 3}
      />

      <ImageWithDescription
        url={images[1].url}
        title={images[1].title}
        description={images[1].description}
        aspectRatio={type == Type.Default ? 16 / 9 : 5 / 4}
      />
    </div>
  );
}
