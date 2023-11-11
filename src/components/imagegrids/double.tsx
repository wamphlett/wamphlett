import ImageWithDescription from "@/components/imageWithDescription";
import { GalleryImage } from "@/app/types";

import styles from "./grids.module.css";

type DoubleProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function Double({ images, inverted = false }: DoubleProps) {
  return (
    <div
      className={
        `flex flex-wrap ` +
        (inverted ? `flex-row-reverse` : `flex-row`) +
        ` ${styles.grid} ${styles.double}`
      }
    >
      <ImageWithDescription
        url={images[0].url}
        title={images[0].title}
        description={images[0].description}
        aspectRatio={1}
      />

      <ImageWithDescription
        url={images[1].url}
        title={images[1].title}
        description={images[1].description}
        aspectRatio={2 / 3.025}
      />
    </div>
  );
}
