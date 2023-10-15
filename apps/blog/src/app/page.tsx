import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from './loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import { callApi } from '@/util/API';
import Sidebar from '@/components/sidebar';
import { notFound } from 'next/navigation';

async function getData() {
  const res = await callApi('/overview', 600);

  if (!res) {
    throw new Error('Failed to fetch data');
  }

  return res;
}

export default async function Page() {
  let data;
  try {
    data = await getData();
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
      sidebar={<Sidebar currentUrl={'/'} topic={null} />}
    >
      <Title
        subtitle="and and sub heading about the piece of exciting content that you are about to read"
        title="My blog"
      />

      <Article html={data.html} />
    </PrimaryLayout>
  );
}
