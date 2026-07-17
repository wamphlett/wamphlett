import HeaderMedia from '../HeaderMedia/HeaderMedia';
import styles from './HeaderVideo.module.css';

export type HeaderVideoProps = {
  padding?: number;
  url: string;
  poster?: string;
  opacity?: number;
  /** Desktop height, e.g. '100vh'. */
  height?: string;
  /** Height at <=850px; falls back to `height` if omitted. */
  tabletHeight?: string;
  /** Height at <=480px; falls back to `tabletHeight`, then `height`, if omitted. */
  mobileHeight?: string;
};

export default function HeaderVideo({
  url,
  padding,
  poster,
  opacity = 0.5,
  height,
  tabletHeight,
  mobileHeight,
}: HeaderVideoProps) {
  return (
    <HeaderMedia
      height={height}
      mediaSlot={
        <video
          autoPlay
          className={styles.video}
          loop
          muted
          playsInline
          poster={poster}
          style={{ opacity }}
        >
          <source src={url} type="video/mp4" />
        </video>
      }
      mobileHeight={mobileHeight}
      padding={padding}
      tabletHeight={tabletHeight}
    />
  );
}
