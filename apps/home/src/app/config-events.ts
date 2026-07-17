import { readConfig } from '@/lib/config-io';
import { getTimelineArticles } from '@/lib/blog-api';
import { ContentType, EventType, Grids } from './types';
import type { EventData, Events } from './data';

// EventData and Events imported as types only — avoids pulling in data.tsx's
// module-level register() side-effects which create a circular dependency.

export async function getOrderedEventsFromConfig(): Promise<
  Map<number, Events>
> {
  const [config, articles] = await Promise.all([
    readConfig().catch(() => ({ updated_ts: 0, events: [] })),
    getTimelineArticles(),
  ]);

  const configEntries = config.events
    .filter(e => e.date_ts > 0)
    .map(event => {
      const date = new Date(event.date_ts * 1000);
      const data: EventData = {
        kind: 'config',
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        type: event.type as EventType,
        title: event.title,
        tagline: event.tagline,
        icon: event.icon,
        small: event.small,
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
      return { dateTs: event.date_ts, data };
    });

  const blogSiteUrl =
    process.env.BLOG_SITE_URL ?? 'https://blog.warrenamphlett.co.uk';

  const blogEntries = articles.map(article => {
    const date = new Date(article.publishedAt * 1000);
    const data: EventData = {
      kind: 'blogPost',
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      title: article.title,
      description: article.description,
      image: article.image,
      url: `${blogSiteUrl}/${article.topicSlug}/${article.slug}`,
    };
    return { dateTs: article.publishedAt, data };
  });

  const events = [...configEntries, ...blogEntries].sort(
    (a, b) => b.dateTs - a.dateTs,
  );

  const grouped = new Map<number, Events>();
  for (const { data } of events) {
    if (!grouped.has(data.year)) {
      grouped.set(data.year, []);
    }
    grouped.get(data.year)!.push(data);
  }
  return grouped;
}
