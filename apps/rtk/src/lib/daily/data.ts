// Where the daily pages get their data. Server only: it reads the file
// system. With RTK_DAILY_PAYLOAD_DIR set, entries are the <date>.json
// payloads in that directory; otherwise they come from ./mock.
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import * as mock from './mock';
import { type DailyPayload, fromPayload } from './payload';
import type { DailyEntry, DailySource, DailySummary } from './types';

const PAYLOAD_FILE = /^\d{4}-\d{2}-\d{2}\.json$/;

const payloadDir = () => process.env.RTK_DAILY_PAYLOAD_DIR;

export const getDailySource = (): DailySource =>
  payloadDir() ? 'file' : 'mock';

function readEntry(file: string): DailyEntry {
  try {
    return fromPayload(JSON.parse(readFileSync(file, 'utf8')) as DailyPayload);
  } catch (error) {
    throw new Error(
      `Could not read the daily payload ${file}: ${(error as Error).message}`,
      { cause: error },
    );
  }
}

export function getDailyIndex(): DailySummary[] {
  const dir = payloadDir();
  if (!dir) {
    return mock.getDailyIndex();
  }
  return readdirSync(dir)
    .filter(name => PAYLOAD_FILE.test(name))
    .sort()
    .reverse()
    .map(name => {
      const entry = readEntry(path.join(dir, name));
      return {
        date: entry.date,
        reviews: entry.stats.reviews,
        targets: entry.targets.map(t => ({
          kanji: t.kanji,
          keyword: t.keyword,
        })),
        backfilled: entry.backfilled,
        done: entry.done,
      };
    });
}

export function getDailyEntry(date: string): DailyEntry | undefined {
  const dir = payloadDir();
  if (!dir) {
    return mock.getDailyEntry(date);
  }
  const name = `${date}.json`;
  // The date comes from the URL: only plain dates, and only listed files.
  if (!PAYLOAD_FILE.test(name) || !readdirSync(dir).includes(name)) {
    return undefined;
  }
  return readEntry(path.join(dir, name));
}
