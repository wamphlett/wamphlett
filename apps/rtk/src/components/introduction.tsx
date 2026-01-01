
import styles from './introduction.module.css';

export default function Introduction({ locale }: { locale: string } ) {
  return (
    <div
      className={`flex flex-row items-center justify-between ${styles.container}`}
      style={{
        // marginTop: 124,
        paddingTop: 124,
        paddingBottom: 24,
      }}
    >
      <div className={styles.content}>
        <div className={styles.name}>
          <h1 className={styles.title}>
            REMEMBERING<br/>
            THE KANJI
            <span>.</span>
          </h1>
          <span className={styles.desc}>My journey through James Heisigs book.</span>
          <span className={styles.sub}>This page documents the stories, comments and keywords that helped me on my path to remembering the kanji. This page documents the stories, comments and keywords that helped me on my path to remembering the kanji.</span>
        </div>
      </div>
    </div>
  );
}
