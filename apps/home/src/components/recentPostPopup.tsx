'use client';
import React, { useEffect, useState } from 'react';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import styles from './recentPostPopup.module.css';

type Article = {
  title: string;
  topicSlug: string;
  slug: string;
  description: string;
  image: string;
  url: string;
  publishedAt: number;
};

const THREE_MONTHS_MS = 3 * 30 * 24 * 60 * 60 * 1000;

export default function RecentPostPopup() {
  const [article, setArticle] = useState<Article | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { blogSiteUrl } = useRuntimeConfig();

  useEffect(() => {
    fetch('/api/recent-post?limit=1')
      .then(r => r.json())
      .then(data => {
        const art: Article = data.articles?.[0];
        if (!art) {
          return;
        }
        const ageMs = Date.now() - art.publishedAt * 1000;
        if (ageMs > THREE_MONTHS_MS) {
          return;
        }
        setArticle(art);
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
      <a
        className={styles.link}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className={styles.imageWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={article.title}
            className={styles.image}
            src={article.image}
          />
        </div>
        <div className={styles.body}>
          <p className={styles.label}>Latest post</p>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.description}>{article.description}</p>
          <span className={styles.readMore}>Read post →</span>
        </div>
      </a>
    </div>
  );
}
