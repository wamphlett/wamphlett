import styles from './title.module.css';

type TitleProps = {
  title: string;
  subtitle?: string;
};

export default function Title({ title, subtitle }: TitleProps) {
  return (
    <div
      className={`flex flex-row items-center justify-between ${styles.container}`}
      style={{
        paddingTop: 124,
        paddingBottom: 24,
      }}
    >
      <h1>{title}</h1>
      {subtitle && <h2>{subtitle}</h2>}
    </div>
  );
}
