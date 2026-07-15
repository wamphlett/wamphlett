import ImageWithDescription from '@/components/imageWithDescription';
import { GalleryImage } from '@/app/types';

import styles from './grids.module.css';

type DoubleProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function Offset({ images, inverted = false }: DoubleProps) {
  return (
    <div
      className={
        'flex flex-wrap ' +
        (inverted ? 'flex-row-reverse' : 'flex-row') +
        ` ${styles.grid} ${styles.offset}`
      }
    >
      <ImageWithDescription
        aspectRatio={16 / 13.6}
        description={images[0].description}
        title={images[0].title}
        url={images[0].url}
      />

      <ImageWithDescription
        aspectRatio={16 / 9}
        description={images[1].description}
        title={images[1].title}
        url={images[1].url}
      />
    </div>
  );
}
