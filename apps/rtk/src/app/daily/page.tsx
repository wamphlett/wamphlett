import type { Metadata } from 'next';
import Link from 'next/link';
import PrimaryLayout from '@/layouts/primary';
import { formatDay } from '@/lib/daily/format';
import { getDailyIndex } from '@/lib/daily/mock';
import styles from '@/components/daily/daily.module.css';

export const metadata: Metadata = { title: 'Daily reading' };

export default function Page() {
  const days = getDailyIndex();
  return (
    <PrimaryLayout headerImageBlurDataURL="" headerImageUrl="">
      <div className={styles.page}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Daily reading<span>.</span>
          </h1>
          <span className={styles.subtitle}>Reading homework, every day.</span>
          <span className={styles.intro}>
            Each day&apos;s entry is built from the kanji I struggled with in
            the previous day&apos;s Anki reviews: real Japanese sentences that
            use them, a short passage, and a sentence to write by hand.
          </span>
          <div className={styles.nav}>
            <Link href="/">All frames</Link>
          </div>
        </div>

        <div className={styles.banner}>
          <b>Mock.</b> Example data only; nothing here is live yet.
        </div>

        {days.map(day => (
          <Link
            className={styles.dayRow}
            href={`/daily/${day.date}`}
            key={day.date}
          >
            <span className={styles.dayDate}>
              {formatDay(day.date, 'short')}
            </span>
            <span className={styles.dayKanji}>
              {day.targets.map(t => (
                <span key={t.kanji}>
                  <b lang="ja">{t.kanji}</b>
                  <span className={styles.muted}>{t.keyword}</span>
                </span>
              ))}
            </span>
            <span className={styles.muted}>
              {day.reviews ? `${day.reviews} reviews` : 'no reviews'}
            </span>
            <span>
              <span
                className={`${styles.chip} ${day.done ? styles.statusDone : ''}`}
              >
                {day.done ? 'Done' : 'Not done'}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </PrimaryLayout>
  );
}
