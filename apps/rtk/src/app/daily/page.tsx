import type { Metadata } from 'next';
import Link from 'next/link';
import PrimaryLayout from '@/layouts/primary';
import { formatDay } from '@/lib/daily/format';
import { getDailyIndex, getDailySource } from '@/lib/daily/data';
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
          {getDailySource() === 'mock' ? (
            <>
              <b>Mock.</b> Example data only; nothing here is live yet.
            </>
          ) : (
            <>
              <b>Local payloads.</b> Entries generated on this machine and read
              from files; nothing here is live yet.
            </>
          )}
        </div>

        <div className={styles.days}>
          {days.map(day => (
            <Link
              className={styles.day}
              href={`/daily/${day.date}`}
              key={day.date}
            >
              <span className={styles.dayHead}>
                <b>{formatDay(day.date, 'short')}</b>
                <span
                  className={`${styles.dot} ${day.done ? styles.done : ''}`}
                  title={day.done ? 'Done' : 'Not done'}
                />
              </span>
              <span className={styles.dayKanji} lang="ja">
                {day.targets.map(t => (
                  <span key={t.kanji}>{t.kanji}</span>
                ))}
              </span>
              <span className={styles.dayKeywords}>
                {day.targets.map(t => t.keyword).join(' · ')}
              </span>
              <span className={styles.dayFoot}>
                {day.reviews ? `${day.reviews} reviews` : 'no reviews'}
                {day.done ? '' : ' · not done'}
                {day.backfilled && ' · generated later'}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </PrimaryLayout>
  );
}
