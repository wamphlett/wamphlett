import ImageWithDescription from '@/components/imageWithDescription';
import { GalleryImage } from '@/app/types';

type DoubleProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function Double({ images, inverted = false }: DoubleProps) {
  return (
    <div
      className={
        'flex flex-wrap ' + (inverted ? 'flex-row-reverse' : 'flex-row')
      }
    >
      <div
        className="flex-grow"
        style={{ padding: 5, minWidth: 200, width: '60%' }}
      >
        <ImageWithDescription
          aspectRatio={1}
          description={images[0].description}
          title={images[0].title}
          url={images[0].url}
        />
      </div>

      <div
        className="flex-grow"
        style={{ padding: 5, minWidth: 200, width: '40%' }}
      >
        <ImageWithDescription
          aspectRatio={2 / 3.025}
          description={images[1].description}
          title={images[1].title}
          url={images[1].url}
        />
      </div>
    </div>
  );
}
