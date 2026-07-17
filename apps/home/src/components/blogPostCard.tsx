import React from 'react';
import styles from './blogPostCard.module.css';

type BlogPostCardProps = {
  title: string;
  description: string;
  image: string;
  url: string;
  label?: string;
};

export default function BlogPostCard({
  title,
  description,
  image,
  url,
  label,
}: BlogPostCardProps) {
  return (
    <a
      className={styles.link}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className={styles.imageWrapper}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={title} className={styles.image} src={image} />
      </div>
      <div className={styles.body}>
        {label && <p className={styles.label}>{label}</p>}
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <span className={styles.readMore}>Read post →</span>
      </div>
    </a>
  );
}
