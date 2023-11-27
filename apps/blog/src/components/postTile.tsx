import LazyImage from '@/components/lazyimage';
import AspectRatioBox from './aspectRatioBox';

import styles from './postTile.module.css';
import { getBlurUrl } from '@/app/loaders';
import Link from 'next/link';

type PostTileProps = {
  title: string;
  description: string;
  timestamp: number;
  url: string;
  image: string;
  compact?: boolean;
  showcase?: boolean;
};

export default async function PostTile({
  title,
  description,
  timestamp,
  url,
  image,
  compact = false,
  showcase = false,
}: PostTileProps) {
  const blurDataUrl = await getBlurUrl(image);

  return (
    <div
      className={`${styles.container} ${compact && styles.compact} ${
        showcase && styles.showcase
      }`}
    >
      <Link href={url}>
        <div className={styles.image}>
          <AspectRatioBox aspectRatio={3 / 2}>
            <LazyImage blurDataURL={blurDataUrl} borderRadius={5} url={image} />
          </AspectRatioBox>
        </div>

        <div className={styles.details}>
          <span className={styles.date}>{formatUnixTimestamp(timestamp)}</span>
          <span className={styles.title}>{title}</span>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

function formatUnixTimestamp(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear().toString();

  return `${day} ${month} ${year}`;
}
