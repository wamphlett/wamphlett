import styles from './postList.module.css';

type PostListProps = {
  heading: string;
  children: React.ReactNode;
};

export default function PostList({ heading, children }: PostListProps) {
  return (
    <div className={styles.container}>
      <span className={styles.heading}>{heading}</span>
      <div className={styles.list}>{children}</div>
    </div>
  );
}
