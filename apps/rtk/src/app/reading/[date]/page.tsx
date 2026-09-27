import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PrimaryLayout from '@/layouts/primary';
import DailyEntry from '@/components/daily/dailyEntry';
import { isTokenValid } from '@/lib/auth';
import { formatDay } from '@/lib/daily/format';
import { getDailyEntry, getDailyIndex, getDailySource } from '@/lib/daily/data';

type Params = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { date } = await params;
  return { title: `Daily reading, ${formatDay(date)}` };
}

export default async function Page({ params }: Params) {
  const { date } = await params;
  const entry = getDailyEntry(date);
  if (!entry) {
    notFound();
  }
  // The index is newest first.
  const dates = getDailyIndex().map(d => d.date);
  const i = dates.indexOf(date);
  const token = (await cookies()).get('TOKEN')?.value;

  return (
    <PrimaryLayout headerImageBlurDataURL="" headerImageUrl="">
      <DailyEntry
        entry={entry}
        loggedIn={isTokenValid(token)}
        nextDate={dates[i - 1]}
        prevDate={dates[i + 1]}
        source={getDailySource()}
      />
    </PrimaryLayout>
  );
}
