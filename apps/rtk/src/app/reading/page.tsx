import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PrimaryLayout from '@/layouts/primary';
import { isTokenValid } from '@/lib/auth';
import { formatDay } from '@/lib/daily/format';
import { DATE, getDailyIndex } from '@/lib/daily/data';
import styles from '@/components/daily/daily.module.css';

export const metadata: Metadata = { title: 'Daily reading' };

// The entries change after a build: read them on every request.
export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ before?: string }> };

export default async function Page({ searchParams }: Props) {
  // Older pages are ?before=<date>, from the API's next_before.
  const { before } = await searchParams;
  if (before !== undefined && !DATE.test(before)) {
    notFound();
  }
  const cookie = (await cookies()).get('TOKEN')?.value;
  const { days, older } = await getDailyIndex(
    isTokenValid(cookie) ? cookie : undefined,
    before,
  );
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
            {before && <Link href="/reading">Newest entries</Link>}
            <Link href="/">All frames</Link>
          </div>
        </div>

        <div className={styles.days}>
          {days.map(day => (
            <Link
              className={styles.day}
              href={`/reading/${day.date}`}
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
                {day.status === 'hidden' && ' · hidden'}
              </span>
            </Link>
          ))}
        </div>
        {days.length === 0 && <p className={styles.intro}>No entries yet.</p>}
        {older && (
          <div className={styles.nav}>
            <Link href={`/reading?before=${older}`}>Older entries</Link>
          </div>
        )}
      </div>
    </PrimaryLayout>
  );
}
