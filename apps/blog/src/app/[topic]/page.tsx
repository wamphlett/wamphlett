import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from '../loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import {
  getTopic,
  GetTopicResponse,
  ListArticleResponse,
  listArticles,
} from '@/util/API';
import Sidebar from '@/components/sidebar';
import logger from '@/lib/logger';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import PostList from '@/components/postList';
import PostTile from '@/components/postTile';

import styles from '../page.module.css';
import { defaultImage } from '../constants';

type PageProps = {
  params: {
    topic: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let data;
  try {
    data = await getTopic(params.topic);
  } catch (e) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist',
    };
  }

  return {
    title: data.title,
    description: data.description,
    authors: { name: 'Warren Amphlett' },
    openGraph: {
      title: `${data.title} | Warren Amphlett Blog`,
      description: data.description,
      images: data.image || defaultImage,
      locale: 'en_GB',
      type: 'article',
      publishedTime: new Date(data.publishedAt * 1000).toISOString(),
      modifiedTime: new Date(data.updatedAt * 1000).toISOString(),
      authors: 'Warren Amphlett',
    },
  };
}

export default async function Page({ params }: PageProps) {
  const start = Date.now();
  let data: GetTopicResponse;
  let articles: ListArticleResponse;
  try {
    data = await getTopic(params.topic);
    articles = await listArticles(params.topic);
  } catch (e) {
    logger.warn(
      {
        method: 'GET',
        path: `/${params.topic}`,
        statusCode: 404,
        durationMs: Date.now() - start,
        err: e,
      },
      'page request',
    );
    return notFound();
  }
  logger.info(
    {
      method: 'GET',
      path: `/${params.topic}`,
      statusCode: 200,
      durationMs: Date.now() - start,
    },
    'page request',
  );

  const headerURL = data.image || defaultImage;
  const blurDataURL = await getBlurUrl(headerURL);

  return (
    <PrimaryLayout
      headerImageBlurDataURL={blurDataURL!}
      headerImageUrl={headerURL}
      sidebar={<Sidebar currentUrl={`/${params.topic}`} topic={params.topic} />}
    >
      <Title subtitle={data.description} title={data.title} />

      <div className={styles.page}>
        <Article html={data.html} />
      </div>

      <PostList heading="Posts in this topic">
        {articles.articles
          .filter(a => a.publishedAt !== 0)
          .sort((a, b) => b.publishedAt - a.publishedAt)
          .map(a => (
            <PostTile
              description={a.description}
              image={a.image || defaultImage}
              key={a.slug}
              timestamp={a.publishedAt}
              title={a.title}
              url={`/${data.slug}/${a.slug}`}
            />
          ))}
      </PostList>
    </PrimaryLayout>
  );
}
