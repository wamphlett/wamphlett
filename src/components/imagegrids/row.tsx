import ImageWithDescription from "@/components/imageWithDescription";
import { GalleryImage } from "@/app/types";

import styles from "./grids.module.css";

type RowProps = {
  images: GalleryImage[];
  aspectRatio?: number;
};

export default function Row({ images, aspectRatio = 1 }: RowProps) {
  return (
    <div className={`flex flex-wrap` + ` ${styles.grid} ${styles.row}`}>
      {images.map((imageData, index) => (
        <ImageWithDescription
          key={index}
          url={imageData.url}
          title={imageData.title}
          description={imageData.description}
          aspectRatio={aspectRatio}
          width="auto"
        />
      ))}
    </div>
  );
}
