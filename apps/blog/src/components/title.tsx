import styles from './title.module.css';
import { Series } from '@/util/API';

type TitleProps = {
  title: string;
  subtitle?: string;
  publishedTimestamp?: number;
  series?: Series;
  currentSlug?: string;
};

export default function Title({
  title,
  subtitle,
  publishedTimestamp,
  series,
  currentSlug,
}: TitleProps) {
  const seriesIndex =
    series?.articles.findIndex(a => a.slug === currentSlug) ?? -1;

  return (
    <div
      className={`flex flex-row items-center justify-between ${styles.container}`}
      style={{
        paddingTop: 124,
        paddingBottom: 24,
      }}
    >
      {publishedTimestamp && (
        <span className={styles.date}>
          {formatUnixTimestamp(publishedTimestamp)}
        </span>
      )}
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
      {series && seriesIndex > -1 && (
        <span className={styles.seriesPill}>
          Part {seriesIndex + 1} of {series.articles.length} &middot;{' '}
          {series.name}
        </span>
      )}
    </div>
  );
}

function formatUnixTimestamp(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);

  // Get the day, month, and year
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().substr(2, 2);

  return `${day} ${month} '${year}`;
}
