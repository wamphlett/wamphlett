import styles from "./gallerytitle.module.css";

type GalleryTitleProps = {
  primary: string;
  secondary?: string;
  description: string;
  expandOnMobile?: boolean;
  smaller?: boolean;
};

export default function GalleryTitle({
  primary,
  secondary,
  description,
  expandOnMobile = true,
  smaller = false
}: GalleryTitleProps) {
  return (
    <div
      className={`flex flex-row items-center justify-between ${styles.container} ${expandOnMobile ? styles.expandOnMobile : ''} ${smaller ? styles.smaller : ''}`}
      style={{
        // marginTop: 124,
        paddingTop: 124,
      }}
    >
      <div className="flex flex-grow flex-col" style={{ alignItems: "center" }}>
        <h1 className={styles.title}>
          {primary}
          <span>{secondary}</span>
        </h1>
        <span className={styles.desc}>{description}</span>
      </div>
    </div>
  );
}
