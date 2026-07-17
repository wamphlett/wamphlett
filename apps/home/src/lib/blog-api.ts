import logger from './logger';

export type TimelineArticle = {
  title: string;
  description: string;
  image: string;
  publishedAt: number;
  topicSlug: string;
  slug: string;
};

type RawArticle = TimelineArticle & {
  metadata?: { timeline?: string };
};

export async function getTimelineArticles(): Promise<TimelineArticle[]> {
  const baseUrl = process.env.BLOG_API_URL ?? 'https://blog.wamphlett.net';

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/recent?limit=100`, {
      next: { revalidate: 300 },
    });
  } catch (err) {
    logger.error(
      { err, upstream: baseUrl },
      'failed to fetch timeline articles',
    );
    return [];
  }

  if (!res.ok) {
    logger.error(
      { statusCode: res.status, upstream: baseUrl },
      'upstream blog api error fetching timeline articles',
    );
    return [];
  }

  const data = (await res.json()) as { articles?: RawArticle[] };
  const articles = data.articles ?? [];

  return articles.filter(article => article.metadata?.timeline === 'true');
}
