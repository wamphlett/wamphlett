import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from '../../loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import Breadcrumb from '@/components/breadcrumb';
import ArticleFooter from '@/components/articleFooter';
import { getArticle, getTopic, listArticles } from '@/util/API';
import Sidebar from '@/components/sidebar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import styles from '../../page.module.css';
import { defaultImage } from '@/app/constants';

type PageProps = {
  params: {
    topic: string;
    article: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let data;
  try {
    data = await getArticle(params.topic, params.article);
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
  let data, topicData, articlesData;
  try {
    [data, topicData, articlesData] = await Promise.all([
      getArticle(params.topic, params.article),
      getTopic(params.topic),
      listArticles(params.topic),
    ]);
  } catch (e) {
    return notFound();
  }

  // Build prev/next from articles sorted newest-first by publishedAt
  const articles = articlesData.articles
    .filter(a => a.publishedAt > 0 && !a.hidden)
    .sort((a, b) => b.publishedAt - a.publishedAt);

  const currentIndex = articles.findIndex(a => a.slug === params.article);
  const prevArticle =
    currentIndex < articles.length - 1
      ? {
          title: articles[currentIndex + 1].title,
          url: `/${params.topic}/${articles[currentIndex + 1].slug}`,
        }
      : null;
  const nextArticle =
    currentIndex > 0
      ? {
          title: articles[currentIndex - 1].title,
          url: `/${params.topic}/${articles[currentIndex - 1].slug}`,
        }
      : null;

  const headerURL = data.image || defaultImage;
  const blurDataURL = await getBlurUrl(headerURL);

  return (
    <PrimaryLayout
      headerImageBlurDataURL={blurDataURL!}
      headerImageUrl={headerURL}
      sidebar={
        <Sidebar
          currentUrl={`/${params.topic}/${params.article}`}
          topic={params.topic}
        />
      }
    >
      <Title
        publishedTimestamp={data.publishedAt}
        subtitle={data.description}
        title={data.title}
      />

      <Breadcrumb
        article={data.title}
        topic={topicData.title}
        topicSlug={params.topic}
      />

      <div className={styles.page}>
        <Article html={data.html} />
      </div>

      <ArticleFooter
        next={nextArticle}
        prev={prevArticle}
        publishedAt={data.publishedAt}
        updatedAt={data.updatedAt}
      />
    </PrimaryLayout>
  );
}
