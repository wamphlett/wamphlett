import styles from './postList.module.css';

type PostListProps = {
  heading: string;
  accentBar?: boolean;
  children: React.ReactNode;
};

export default function PostList({
  heading,
  accentBar,
  children,
}: PostListProps) {
  return (
    <div className={styles.container}>
      <span
        className={`${styles.heading} ${accentBar ? styles.accentBar : ''}`}
      >
        {heading}
      </span>
      <div className={styles.list}>{children}</div>
    </div>
  );
}
