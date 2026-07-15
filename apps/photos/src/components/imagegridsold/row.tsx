import ImageWithDescription from '@/components/imageWithDescription';
import { GalleryImage } from '@/app/types';

type RowProps = {
  images: GalleryImage[];
  aspectRatio?: number;
};

export default function Row({ images, aspectRatio = 1 }: RowProps) {
  return (
    <div className={'flex flex-wrap'}>
      {images.map((imageData, index) => (
        <div
          className="flex-grow"
          key={index}
          style={{ padding: 5, minWidth: 200 }}
        >
          <ImageWithDescription
            aspectRatio={aspectRatio}
            description={imageData.description}
            title={imageData.title}
            url={imageData.url}
          />
        </div>
      ))}
    </div>
  );
}
