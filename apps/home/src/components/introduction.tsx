import TextReel from './textReel';
import { GithubIcon, LinkedInIcon } from './svgs';

import styles from './introduction.module.css';
import CircleIconLink from './circleIconLink';

export default function Introduction() {
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
            Warren
            <br />
            Amphlett<span>.</span>
          </h1>
          <span className={styles.desc}>software engineer / photographer</span>
        </div>

        <div className={styles.details}>
          <span>tech I play with</span>
          <span className={styles.main}>GO PHP NODE FLUTTER</span>

          <div className={styles.extra}>
            <TextReel>
              <span>kubernetes docker unix</span>
              <span>gRPC rabbitMQ</span>
              <span>MySQL mongoDB</span>
              <span>redis memcached</span>
              <span>nodejs react nextjs css sass</span>
              <span>GCP AWS</span>
            </TextReel>
          </div>

          <div className={styles.icons}>
            <CircleIconLink
              href="https://github.com/wamphlett/"
              icon={<GithubIcon />}
              size={36}
            />
            <CircleIconLink
              href="https://www.linkedin.com/in/warren-amphlett-5bb9b6170/"
              icon={<LinkedInIcon />}
              size={36}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
