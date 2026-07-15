import { context, propagation } from '@opentelemetry/api';
import logger from '@/lib/logger';
import { upstreamRequestDuration, upstreamRequestErrors } from '@/lib/metrics';

type apiOptions = {
  cacheSeconds?: number;
  tags?: string[];
};

type ArticleDetails = {
  title: string;
  description: string;
  image: string;
  publishedAt: number;
  updatedAt: number;
  hidden: boolean;
  topicSlug: string;
  slug: string;
  priority?: number;
};

type TopicDetails = {
  title: string;
  description: string;
  image: string;
  url: string;
  slug: string;
  priority?: number;
  publishedAt: number;
  updatedAt: number;
  hidden: boolean;
  publishedArticleCount: number;
  articleUrl: string;
};

const callApi = async (route: string, apiOptions: apiOptions = {}) => {
  const baseUrl = process.env.BLOG_API_URL ?? '';
  const url = baseUrl + route;
  const routePath = route.split('?')[0];
  const start = Date.now();

  const traceHeaders: Record<string, string> = {};
  propagation.inject(context.active(), traceHeaders);

  let res: Response;
  try {
    res = await fetch(url, {
      headers: traceHeaders,
      next: {
        revalidate: apiOptions.cacheSeconds || 3600,
        tags: ['everything'].concat(apiOptions.tags || []),
      },
    });
  } catch (err) {
    const durationMs = Date.now() - start;
    logger.error(
      { method: 'GET', url, durationMs, err },
      'upstream api request failed',
    );
    upstreamRequestErrors.add(1, { route: routePath, error: 'network' });
    upstreamRequestDuration.record(durationMs, {
      route: routePath,
      error: 'network',
    });
    throw err;
  }

  const durationMs = Date.now() - start;

  if (!res.ok) {
    logger.error(
      { method: 'GET', url, statusCode: res.status, durationMs },
      'upstream api error',
    );
    upstreamRequestErrors.add(1, { route: routePath, status_code: res.status });
    upstreamRequestDuration.record(durationMs, {
      route: routePath,
      status_code: res.status,
    });
    throw new Error('Failed to fetch data from server. path: ' + url);
  }

  logger.info(
    { method: 'GET', url, statusCode: res.status, durationMs },
    'upstream api call',
  );
  upstreamRequestDuration.record(durationMs, {
    route: routePath,
    status_code: res.status,
  });

  return await res.json();
};

export type GetOverviewResponse = ArticleDetails & {
  html: string;
};

export const getOverview = async (): Promise<GetOverviewResponse> =>
  await callApi('/overview');

export type RecentResponse = {
  articles: ArticleDetails[];
};

export const getRecent = async (limit = 3): Promise<RecentResponse> =>
  await callApi('/recent?limit=' + limit, {
    tags: ['sidebar', 'recent'],
  });

export type ListTopicsResponse = {
  topics: TopicDetails[];
};

export const listTopics = async (): Promise<ListTopicsResponse> =>
  await callApi('/topics', {
    tags: ['sidebar'],
  });

export type GetTopicResponse = TopicDetails & {
  html: string;
};

export const getTopic = async (topic: string): Promise<GetTopicResponse> =>
  await callApi('/topics/' + topic);

export type ListArticleResponse = {
  articles: ArticleDetails[];
};

export const listArticles = async (
  topic: string,
): Promise<ListArticleResponse> =>
  await callApi('/topics/' + topic + '/articles', {
    tags: ['sidebar', 'recent'],
  });

export type SeriesArticle = {
  title: string;
  slug: string;
  topicSlug: string;
  url: string;
  publishedAt: number;
  published: boolean;
};

export type Series = {
  name: string;
  articles: SeriesArticle[];
};

export type GetArticleResponse = ArticleDetails & {
  html: string;
  series?: Series;
};

export const getArticle = async (
  topic: string,
  article: string,
): Promise<GetArticleResponse> =>
  await callApi('/topics/' + topic + '/articles/' + article);
