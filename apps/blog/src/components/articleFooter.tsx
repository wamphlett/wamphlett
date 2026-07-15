import Link from 'next/link';
import styles from './articleFooter.module.css';

type ArticleLink = {
  title: string;
  url: string;
};

type ArticleFooterProps = {
  prev: ArticleLink | null;
  next: ArticleLink | null;
  updatedAt: number;
  publishedAt: number;
};

export default function ArticleFooter({
  prev,
  next,
  updatedAt,
  publishedAt,
}: ArticleFooterProps) {
  const showUpdated = updatedAt > 0 && updatedAt !== publishedAt;

  return (
    <div className={styles.container}>
      {(prev || next) && (
        <nav className={styles.nav}>
          <div className={styles.prev}>
            {prev && (
              <Link href={prev.url}>
                <span className={styles.label}>← Older</span>
                <span className={styles.title}>{prev.title}</span>
              </Link>
            )}
          </div>
          <div className={styles.next}>
            {next && (
              <Link href={next.url}>
                <span className={styles.label}>Newer →</span>
                <span className={styles.title}>{next.title}</span>
              </Link>
            )}
          </div>
        </nav>
      )}
      {showUpdated && (
        <p className={styles.updated}>Last updated {formatDate(updatedAt)}</p>
      )}
    </div>
  );
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
