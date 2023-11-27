import styles from "./gallerytitle.module.css";

type GalleryTitleProps = {
  primary: string;
  secondary?: string;
  description: string;
};

export default function GalleryTitle({
  primary,
  secondary,
  description,
}: GalleryTitleProps) {
  return (
    <div
      className={`flex flex-row items-center justify-between ${styles.container}`}
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
