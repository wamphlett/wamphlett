'use client';
import React, { useEffect, useState } from 'react';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import BlogPostCard from './blogPostCard';
import styles from './recentPostPopup.module.css';

type Article = {
  title: string;
  topicSlug: string;
  slug: string;
  description: string;
  image: string;
  url: string;
  publishedAt: number;
  metadata?: { featured?: string };
};

const THREE_MONTHS_MS = 3 * 30 * 24 * 60 * 60 * 1000;

export default function RecentPostPopup() {
  const [article, setArticle] = useState<Article | null>(null);
  const [label, setLabel] = useState('Latest post');
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { blogSiteUrl } = useRuntimeConfig();

  useEffect(() => {
    fetch('/api/recent-post?limit=100')
      .then(r => r.json())
      .then(data => {
        const articles: Article[] = data.articles ?? [];
        const index = articles.findIndex(a => a.metadata?.featured === 'true');
        if (index === -1) {
          return;
        }
        const art = articles[index];
        const ageMs = Date.now() - art.publishedAt * 1000;
        if (ageMs > THREE_MONTHS_MS) {
          return;
        }
        setArticle(art);
        setLabel(index === 0 ? 'Latest post' : 'Recent post');
        setTimeout(() => setVisible(true), 2400);
      })
      .catch(() => {});
  }, []);

  if (!article || dismissed) {
    return null;
  }

  const blogBaseUrl = blogSiteUrl ?? 'https://blog.warrenamphlett.co.uk';
  const href = `${blogBaseUrl}/${article.topicSlug}/${article.slug}`;

  return (
    <div className={`${styles.popup} ${visible ? styles.visible : ''}`}>
      <button
        aria-label="Dismiss"
        className={styles.close}
        onClick={() => setDismissed(true)}
      >
        ✕
      </button>
      <BlogPostCard
        description={article.description}
        image={article.image}
        label={label}
        title={article.title}
        url={href}
      />
    </div>
  );
}
