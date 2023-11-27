import ImageWithDescription from "@/components/imageWithDescription";
import { GalleryImage } from "@/app/types";

type RowProps = {
  images: GalleryImage[];
  aspectRatio?: number;
};

export default function Row({ images, aspectRatio = 1 }: RowProps) {
  return (
    <div className={`flex flex-wrap`}>
      {images.map((imageData, index) => (
        <div
          key={index}
          className="flex-grow"
          style={{ padding: 5, minWidth: 200 }}
        >
          <ImageWithDescription
            url={imageData.url}
            title={imageData.title}
            description={imageData.description}
            aspectRatio={aspectRatio}
          />
        </div>
      ))}
    </div>
  );
}
