import styles from './title.module.css';

type TitleProps = {
  title: string;
  subtitle?: string;
  publishedTimestamp?: number;
};

export default function Title({
  title,
  subtitle,
  publishedTimestamp,
}: TitleProps) {
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
