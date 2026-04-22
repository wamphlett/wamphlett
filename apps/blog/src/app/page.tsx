import PrimaryLayout from '@/layouts/primary';
import { getBlurUrl } from './loaders';
import Title from '@/components/title';
import Article from '@/components/article';
import { getOverview, getRecent } from '@/util/API';
import Sidebar from '@/components/sidebar';
import { notFound } from 'next/navigation';
import { defaultImage } from './constants';
import PostList from '@/components/postList';
import PostTile from '@/components/postTile';
import { Metadata } from 'next';

type RecentPost = {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: number;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    authors: { name: 'Warren Amphlett' },
    openGraph: {
      title: 'Warren Amphlett Blog',
      description: 'The Ramblings of a software engineer',
      images:
        'https://library.wamphlett.net/photos/blog/headers/default.jpg?w=800',
      locale: 'en_GB',
      type: 'article',
      authors: 'Warren Amphlett',
    },
  };
}

export default async function Page() {
  let data;
  try {
    data = await getOverview();
  } catch (e) {
    return notFound();
  }

  const headerURL = defaultImage;
  const blurDataURL = await getBlurUrl(headerURL);

  const recentPosts: RecentPost[] = [];
  const recentRes = await getRecent(7);
  await Promise.all(
    recentRes.articles.map(async a => {
      recentPosts.push({
        title: a.title,
        description: a.description,
        publishedAt: a.publishedAt,
        image: a.image,
        url: `/${a.topicSlug}/${a.slug}`,
      });
    }),
  );

  return (
    <PrimaryLayout
      headerImageBlurDataURL={blurDataURL!}
      headerImageUrl={headerURL}
      sidebar={<Sidebar currentUrl={'/'} topic={null} />}
    >
      <Title
        subtitle="I like to write code and take photos. I'm not a huge fan of writing but needed somewhere to post my ramblings."
        title="My blog"
      />

      <Article html={data.html} />

      <PostList heading="Recent posts">
        {recentPosts.map((a: RecentPost, index: number) => (
          <PostTile
            description={a.description}
            image={a.image || defaultImage}
            key={index}
            showcase={index === 0}
            timestamp={a.publishedAt}
            title={a.title}
            url={a.url}
          />
        ))}
      </PostList>
    </PrimaryLayout>
  );
}
