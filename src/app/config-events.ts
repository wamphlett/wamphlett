import { readConfig } from '@/lib/config-io';
import { ContentType, Grids, EventType } from './types';
import type { EventData, Events } from './data';

// EventData and Events imported as types only — avoids pulling in data.tsx's
// module-level register() side-effects which create a circular dependency.

export async function getOrderedEventsFromConfig(): Promise<Map<number, Events>> {
  let config;
  try {
    config = await readConfig();
  } catch {
    return new Map();
  }

  const events: EventData[] = config.events
    .filter(e => e.date_ts > 0)
    .slice()
    .sort((a, b) => b.date_ts - a.date_ts)
    .map(event => {
      const date = new Date(event.date_ts * 1000);
      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        type: event.type as EventType,
        title: event.title,
        tagline: event.tagline,
        icon: event.icon,
        intro: event.sub_title,
        images: (event.image_grid ?? []).map(row => ({
          kind: ContentType.ImageGrid as const,
          grid: row.grid_type as Grids,
          aspectRatio: row.ratio ? row.ratio[0] / row.ratio[1] : undefined,
          images: row.images.map(img => ({
            url: img.url,
            title: img.title,
            description: img.tagline,
          })),
        })),
      };
    });

  const grouped = new Map<number, Events>();
  for (const event of events) {
    if (!grouped.has(event.year)) grouped.set(event.year, []);
    grouped.get(event.year)!.push(event);
  }
  return grouped;
}
