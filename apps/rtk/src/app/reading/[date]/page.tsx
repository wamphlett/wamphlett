import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import PrimaryLayout from '@/layouts/primary';
import DailyEntry from '@/components/daily/dailyEntry';
import { isTokenValid } from '@/lib/auth';
import { formatDay } from '@/lib/daily/format';
import { DATE, getDailyEntry, getNeighbours } from '@/lib/daily/data';

type Params = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { date } = await params;
  return {
    title: DATE.test(date) ? `Daily reading, ${formatDay(date)}` : undefined,
  };
}

export default async function Page({ params }: Params) {
  const { date } = await params;
  if (!DATE.test(date)) {
    notFound();
  }
  const cookie = (await cookies()).get('TOKEN')?.value;
  const token = isTokenValid(cookie) ? cookie : undefined;
  const [entry, { prevDate, nextDate }] = await Promise.all([
    getDailyEntry(date, token),
    getNeighbours(date, token),
  ]);
  if (!entry) {
    notFound();
  }

  return (
    <PrimaryLayout headerImageBlurDataURL="" headerImageUrl="">
      <DailyEntry
        entry={entry}
        nextDate={nextDate}
        prevDate={prevDate}
        token={token}
      />
    </PrimaryLayout>
  );
}
