import { getRecent, listArticles, listTopics } from '@/util/API';
import Link from 'next/link';

import styles from './sidebar.module.css';
import PostTile from './postTile';
import { defaultImage } from '@/app/constants';

type SidebarLink = {
  title: string;
  url: string;
  slug: string;
  priority?: number;
  publishedAt: number;
  hidden: boolean;
  description: string;
};

type RecentPost = {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedAt: number;
};

type SidebarData = {
  current: SidebarLink | null;
  articles: SidebarLink[];
  topics: SidebarLink[];
  recent: RecentPost[];
};

async function buildSidebar(topic: string | null): Promise<SidebarData> {
  const res = await listTopics();
  const data: SidebarData = {
    articles: [],
    topics: [],
    current: null,
    recent: [],
  };
  await Promise.all(
    res.topics.map(async t => {
      if (t.slug === topic) {
        data.current = {
          title: t.title,
          url: `/${t.slug}`,
          priority: t.priority || 0,
          slug: t.slug,
          publishedAt: t.publishedAt,
          hidden: t.hidden,
          description: '',
        };

        const res = await listArticles(t.slug);
        await Promise.all(
          res.articles.map(async a => {
            data.articles.push({
              title: a.title,
              url: `/${t.slug}/${a.slug}`,
              priority: a.priority || 0,
              slug: a.slug,
              publishedAt: a.publishedAt,
              hidden: a.hidden,
              description: a.description,
            });
          }),
        );
      } else {
        if (t.publishedAt == 0 || t.hidden || t.publishedArticleCount == 0) {
          return;
        }

        data.topics.push({
          title: t.title,
          url: `/${t.slug}`,
          priority: t.priority || 0,
          slug: t.slug,
          publishedAt: t.publishedAt,
          hidden: t.hidden,
          description: '',
        });
      }
    }),
  );

  const recentRes = await getRecent();
  await Promise.all(
    recentRes.articles.map(async a => {
      data.recent.push({
        title: a.title,
        description: a.description,
        publishedAt: a.publishedAt,
        image: a.image,
        url: `/${a.topicSlug}/${a.slug}`,
      });
    }),
  );

  data.topics.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  data.articles.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return data;
}

type SidebarProps = {
  topic: string | null;
  currentUrl: string;
};

export default async function Sidebar({ topic, currentUrl }: SidebarProps) {
  let data: SidebarData;
  try {
    data = await buildSidebar(topic);
  } catch (e) {
    return <div></div>;
  }

  const topicTitle = data.current ? 'Other topics' : 'Topics';

  return (
    <div className={styles.container}>
      {data.current && (
        <div className={styles.section}>
          <span className={styles.more}>more from</span>
          <span className={styles.current}>
            <Link href={data.current.url}>{data.current.title}</Link>
          </span>
          <ul>
            {data.articles
              .filter(a => a.publishedAt !== 0)
              .sort((a, b) => b.publishedAt - a.publishedAt)
              .map((a, i) => (
                <li
                  className={currentUrl === a.url ? styles.active : ''}
                  key={i}
                >
                  <Link href={a.url}>{a.title}</Link>
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className={styles.section}>
        <span className={styles.other}>{topicTitle}</span>
        <ul>
          {data.topics.map((t, i) => (
            <li key={i}>
              <Link href={t.url}>{t.title}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className={`${styles.section} ${styles.nomobile}`}>
        <span className={styles.other}>Recent posts</span>
        <div className={styles.recentList}>
          {data.recent.map((a, i) => (
            <PostTile
              compact
              description={a.description}
              image={a.image || defaultImage}
              key={i}
              timestamp={a.publishedAt}
              title={a.title}
              url={a.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
