
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
          <span className={styles.desc}>How I remembered the Kanji.</span>
          <span className={styles.sub}>This page documents the stories, keywords, and personal notes that helped me remember kanji while studying James Heisig’s Remembering the Kanji.</span>
        </div>
      </div>
    </div>
  );
}
