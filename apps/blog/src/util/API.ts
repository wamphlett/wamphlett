import logger from '@/lib/logger';

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
  const baseUrl = process.env.REACT_APP_API_URL ?? '';
  const url = baseUrl + route;
  const start = Date.now();

  let res: Response;
  try {
    res = await fetch(url, {
      next: {
        revalidate: apiOptions.cacheSeconds || 3600,
        tags: ['everything'].concat(apiOptions.tags || []),
      },
    });
  } catch (err) {
    logger.error(
      { method: 'GET', url, durationMs: Date.now() - start, err },
      'upstream api request failed',
    );
    throw err;
  }

  if (!res.ok) {
    logger.error(
      {
        method: 'GET',
        url,
        statusCode: res.status,
        durationMs: Date.now() - start,
      },
      'upstream api error',
    );
    throw new Error('Failed to fetch data from server. path: ' + url);
  }

  logger.info(
    {
      method: 'GET',
      url,
      statusCode: res.status,
      durationMs: Date.now() - start,
    },
    'upstream api call',
  );

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

export type GetArticleResponse = ArticleDetails & {
  html: string;
};

export const getArticle = async (
  topic: string,
  article: string,
): Promise<GetArticleResponse> =>
  await callApi('/topics/' + topic + '/articles/' + article);
