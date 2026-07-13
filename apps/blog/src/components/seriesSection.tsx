import Link from 'next/link';
import styles from './seriesSection.module.css';
import { Series } from '@/util/API';

type SeriesSectionProps = {
  series: Series;
  currentSlug: string;
};

export default function SeriesSection({
  series,
  currentSlug,
}: SeriesSectionProps) {
  const publishedCount = series.articles.filter(a => a.published).length;

  return (
    <div className={styles.container}>
      <span className={styles.label}>This post is part of a series</span>
      <div className={styles.headerRow}>
        <span className={styles.name}>{series.name}</span>
        <span className={styles.progress}>
          {publishedCount} of {series.articles.length} published
        </span>
      </div>

      <span className={styles.subheading}>Read related articles</span>

      <ul className={styles.steps}>
        {series.articles.map((a, i) => {
          const isCurrent = a.slug === currentSlug;
          const nodeClass = isCurrent
            ? styles.nodeCurrent
            : a.published
            ? styles.nodePublished
            : styles.nodeUpcoming;

          return (
            <li className={styles.step} key={i}>
              <span className={`${styles.node} ${nodeClass}`}>{i + 1}</span>
              <div className={styles.content}>
                {isCurrent ? (
                  <>
                    <span className={styles.currentTitle}>{a.title}</span>
                    <span className={styles.currentBadge}>Reading now</span>
                  </>
                ) : a.published ? (
                  <Link className={styles.link} href={`/${a.topicSlug}/${a.slug}`}>
                    {a.title}
                  </Link>
                ) : (
                  <>
                    <span className={styles.upcomingTitle}>{a.title}</span>
                    <span className={styles.tag}>Coming soon</span>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
