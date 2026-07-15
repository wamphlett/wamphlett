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
        `flex flex-wrap ` +
        (inverted ? `flex-row-reverse` : `flex-row`) +
        ` ${styles.grid} ${styles.triWide}`
      }
    >
      <ImageWithDescription
        url={images[0].url}
        title={images[0].title}
        description={images[0].description}
        aspectRatio={2 / 3.25}
      />
      <div>
        <ImageWithDescription
          url={images[1].url}
          title={images[1].title}
          description={images[1].description}
          aspectRatio={21 / 9}
        />
        <ImageWithDescription
          url={images[2].url}
          title={images[2].title}
          description={images[2].description}
          aspectRatio={21 / 9}
        />
      </div>
    </div>
  );
}
