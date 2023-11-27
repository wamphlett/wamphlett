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
  if (process.env.REACT_APP_API_URL != '') {
    route = process.env.REACT_APP_API_URL + route;
  }

  const res = await fetch(route, {
    next: {
      // cache all requests for 30 days by default
      revalidate: apiOptions.cacheSeconds || 86400 * 30,
      tags: ['everything'].concat(apiOptions.tags || []),
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data from server. path: ' + route);
  }

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
