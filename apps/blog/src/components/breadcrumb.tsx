import Link from 'next/link';
import styles from './breadcrumb.module.css';

type BreadcrumbProps = {
  topic: string;
  topicSlug: string;
  article: string;
};

export default function Breadcrumb({
  topic,
  topicSlug,
  article,
}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={styles.container}>
      <Link href="/">Home</Link>
      <span className={styles.sep}>/</span>
      <Link href={`/${topicSlug}`}>{topic}</Link>
      <span className={styles.sep}>/</span>
      <span className={styles.current}>{article}</span>
    </nav>
  );
}
