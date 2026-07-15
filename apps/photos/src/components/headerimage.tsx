import LazyImage from '@/components/lazyimage';

import styles from './headerImage.module.css';

type HeaderImageProps = {
  padding?: number;
  url: string;
  blurDataURL: string;
};

export default function HeaderImage({
  url,
  blurDataURL,
  padding = 24,
}: HeaderImageProps) {
  return (
    <div
      className={`flex flex-col absolute top-0 left-0 right-0 ${styles.container}`}
      style={{
        padding: padding,
      }}
    >
      <div className="bg-black flex-grow overflow-hidden flex flex-col">
        <LazyImage
          url={url}
          opacity={0.5}
          borderRadius={0}
          blurDataURL={blurDataURL}
          priority={true}
        />
      </div>
    </div>
  );
}
