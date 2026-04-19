import ImageWithDescription from "@/components/imageWithDescription";
import { GalleryImage } from "@/app/types";

import styles from "./grids.module.css";

type TriSquareProps = {
  images: GalleryImage[];
  inverted?: boolean;
};

export default function TriSquare({
  images,
  inverted = false,
}: TriSquareProps) {
  return (
    <div
      className={
        `flex flex-wrap ` +
        (inverted ? `flex-row-reverse` : `flex-row`) +
        ` ${styles.grid} ${styles.triSquare}`
      }
    >
      <ImageWithDescription
        url={images[0].url}
        title={images[0].title}
        description={images[0].description}
        aspectRatio={16 / 13}
      />
      <div>
        <ImageWithDescription
          url={images[1].url}
          title={images[1].title}
          description={images[1].description}
          aspectRatio={16 / 9.65}
        />
        <ImageWithDescription
          url={images[2].url}
          title={images[2].title}
          description={images[2].description}
          aspectRatio={16 / 9.65}
        />
      </div>
    </div>
  );
}
