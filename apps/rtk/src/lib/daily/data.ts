// Where the daily pages get their data: rtk-api, on every request. Server
// only. The token is the TOKEN cookie, already checked with isTokenValid; with
// it, rtk-api also returns hidden entries and sentences.
import {
  type DailyList,
  type DailyResponse,
  fromListItem,
  fromPayload,
} from './payload';
import type { DailyEntry, DailySummary } from './types';

export const DATE = /^\d{4}-\d{2}-\d{2}$/;

// The API's largest page.
const MAX_LIMIT = 400;

// undefined on a 404; any other failure throws.
async function get<T>(path: string, token?: string): Promise<T | undefined> {
  const url = `${process.env.RTK_API_URL ?? 'https://rtk.wamphlett.net'}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      cache: 'no-store',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  } catch (error) {
    throw new Error(
      `Could not reach rtk-api at ${url}: ${(error as Error).message}`,
      { cause: error },
    );
  }
  if (res.status === 404) {
    return undefined;
  }
  if (!res.ok) {
    const body = (await res.text()).trim();
    throw new Error(
      `rtk-api answered ${res.status} for GET ${url}${body ? `: ${body}` : ''}`,
    );
  }
  return (await res.json()) as T;
}

async function list(
  query: Record<string, string>,
  token?: string,
): Promise<DailyList> {
  const path = `/reading?${new URLSearchParams(query)}`;
  const page = await get<DailyList>(path, token);
  if (!page) {
    throw new Error(`rtk-api answered 404 for GET ${path}`);
  }
  return page;
}

// One page of the index, newest first. `older` is the `before` date for the
// next page, null on the last one.
export async function getDailyIndex(
  token?: string,
  before?: string,
): Promise<{ days: DailySummary[]; older: string | null }> {
  const page = await list(before ? { before } : {}, token);
  return { days: page.entries.map(fromListItem), older: page.next_before };
}

export async function getDailyEntry(
  date: string,
  token?: string,
): Promise<DailyEntry | undefined> {
  const payload = await get<DailyResponse>(`/reading/${date}`, token);
  return payload && fromPayload(payload);
}

// The entries either side of a date, among those the token can see.
export async function getNeighbours(
  date: string,
  token?: string,
): Promise<{ prevDate?: string; nextDate?: string }> {
  // The list is newest first, so the next entry is the last of the ones
  // after the date: page until the oldest of them.
  const dayAfter = new Date(Date.parse(`${date}T00:00:00Z`) + 86_400_000)
    .toISOString()
    .slice(0, 10);
  const findNext = async (before?: string): Promise<string | undefined> => {
    const page = await list(
      {
        since: dayAfter,
        limit: String(MAX_LIMIT),
        ...(before ? { before } : {}),
      },
      token,
    );
    return page.next_before
      ? findNext(page.next_before)
      : page.entries.at(-1)?.date;
  };
  const [prev, nextDate] = await Promise.all([
    list({ before: date, limit: '1' }, token),
    findNext(),
  ]);
  return { prevDate: prev.entries[0]?.date, nextDate };
}
