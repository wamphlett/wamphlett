import ImageWithDescription from '@/components/imageWithDescription';
import { GalleryImage } from '@/app/types';

import styles from './grids.module.css';

type TriWideProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function TriWide({ images, inverted = false }: TriWideProps) {
  return (
    <div
      className={
        'flex flex-wrap ' +
        (inverted ? 'flex-row-reverse' : 'flex-row') +
        ` ${styles.grid} ${styles.triWide}`
      }
    >
      <ImageWithDescription
        aspectRatio={2 / 3.25}
        description={images[0].description}
        title={images[0].title}
        url={images[0].url}
      />
      <div>
        <ImageWithDescription
          aspectRatio={21 / 9}
          description={images[1].description}
          title={images[1].title}
          url={images[1].url}
        />
        <ImageWithDescription
          aspectRatio={21 / 9}
          description={images[2].description}
          title={images[2].title}
          url={images[2].url}
        />
      </div>
    </div>
  );
}
