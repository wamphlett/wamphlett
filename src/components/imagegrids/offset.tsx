import ImageWithDescription from "@/components/imageWithDescription";
import { GalleryImage } from "@/app/types";

import styles from "./grids.module.css";

type DoubleProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function Offset({ images, inverted = false }: DoubleProps) {
  return (
    <div
      className={
        `flex flex-wrap ` +
        (inverted ? `flex-row-reverse` : `flex-row`) +
        ` ${styles.grid} ${styles.offset}`
      }
    >
      <ImageWithDescription
        url={images[0].url}
        title={images[0].title}
        description={images[0].description}
        aspectRatio={16 / 13.6}
      />

      <ImageWithDescription
        url={images[1].url}
        title={images[1].title}
        description={images[1].description}
        aspectRatio={16 / 9}
      />
    </div>
  );
}
