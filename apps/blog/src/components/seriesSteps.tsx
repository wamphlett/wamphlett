import Link from 'next/link';
import styles from './seriesSection.module.css';
import { Series } from '@/util/API';
import { isStagingMode } from '@/util/staging';

type SeriesStepsProps = {
  series: Series;
  currentSlug: string;
  onCurrentClick?: () => void;
};

export default function SeriesSteps({
  series,
  currentSlug,
  onCurrentClick,
}: SeriesStepsProps) {
  const staging = isStagingMode();
  const isReadable = (published: boolean) => published || staging;

  return (
    <ul className={styles.steps}>
      {series.articles.map((a, i) => {
        const isCurrent = a.slug === currentSlug;
        const nodeClass = isCurrent
          ? styles.nodeCurrent
          : isReadable(a.published)
          ? styles.nodePublished
          : styles.nodeUpcoming;

        return (
          <li className={styles.step} key={i}>
            <span className={`${styles.node} ${nodeClass}`}>{i + 1}</span>
            <div
              className={styles.content}
              onClick={isCurrent ? onCurrentClick : undefined}
              style={
                isCurrent && onCurrentClick ? { cursor: 'pointer' } : undefined
              }
            >
              {isCurrent ? (
                <>
                  <span className={styles.currentTitle}>{a.title}</span>
                  <span className={styles.currentBadge}>Reading now</span>
                </>
              ) : isReadable(a.published) ? (
                <Link
                  className={styles.link}
                  href={`/${a.topicSlug}/${a.slug}`}
                >
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
  );
}
