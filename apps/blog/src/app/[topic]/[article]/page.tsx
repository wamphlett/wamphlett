import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from '../../loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import { callApi } from '@/util/API';
import Sidebar from '@/components/sidebar';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type PageProps = {
  params: {
    topic: string;
    article: string;
  };
};

async function getData(topic: string, article: string) {
  const res = await callApi(`/topics/${topic}/articles/${article}`, 600);

  if (!res) {
    throw new Error('Failed to fetch data');
  }

  return res;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let data;
  try {
    data = await getData(params.topic, params.article);
  } catch (e) {
    return {
      title: 'Not Found',
      description: 'The page you are looking for does not exist',
    };
  }

  return {
    title: `${data.title} | Warren Amphlett Blog`,
  };
}

export default async function Page({ params }: PageProps) {
  let data;
  try {
    data = await getData(params.topic, params.article);
  } catch (e) {
    return notFound();
  }

  const headerURL =
    'https://library.wamphlett.net/photos/website/2023/albania/lifes-better-by-the-sea.jpg';
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
        subtitle="and and sub heading about the piece of exciting content that you are about to read"
        title={data.title}
      />

      <Article html={data.html} />
    </PrimaryLayout>
  );
}
