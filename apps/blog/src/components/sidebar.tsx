import { callApi } from '@/util/API';
import Link from 'next/link';

import styles from './sidebar.module.css';

type SidebarLink = {
  title: string;
  url: string;
  slug: string;
  priority?: number;
};

type SidebarData = {
  current: SidebarLink | null;
  articles: SidebarLink[];
  topics: SidebarLink[];
};

async function getSidebarData(url: string) {
  const res = await callApi(url, 1200);

  if (!res) {
    throw new Error(`failed to fetch sidebar data for ${url}`);
  }

  return res;
}

async function buildSidebar(topic: string | null): Promise<SidebarData> {
  const res = await getSidebarData('/topics');
  const data: SidebarData = { articles: [], topics: [] };
  await Promise.all(
    res.topics.map(async (t: SidebarLink) => {
      if (t.slug === topic) {
        data.current = {
          title: t.title,
          url: `/${t.slug}`,
          priority: t.priority,
          slug: t.slug,
        };

        const res = await getSidebarData(`/topics/${topic}/articles`);
        await Promise.all(
          res.articles.map(async (a: SidebarLink) => {
            data.articles.push({
              title: a.title,
              url: `/${t.slug}/${a.slug}`,
              priority: a.priority,
              slug: a.slug,
            });
          }),
        );
      } else {
        data.topics.push({
          title: t.title,
          url: `/${t.slug}`,
          priority: t.priority,
          slug: t.slug,
        });
      }
    }),
  );

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
            {data.articles.map((a, i) => (
              <li className={currentUrl === a.url ? styles.active : ''} key={i}>
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
    </div>
  );
}
