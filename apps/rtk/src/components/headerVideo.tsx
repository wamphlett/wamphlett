'use client';

import styles from './headerVideo.module.css';

type HeaderVideoProps = {
  url: string;
  padding?: number;
  poster?: string;
  opacity?: number;
};

export default function HeaderVideo({
  url,
  padding = 24,
  poster,
  opacity = 0.5,
}: HeaderVideoProps) {
  return (
    <div
      className={
        styles.container + ' flex flex-col absolute top-0 left-0 right-0'
      }
      style={{ padding }}
    >
      <div className="bg-black flex-grow overflow-hidden flex flex-col">
        <video
          autoPlay
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          poster={poster}
          style={{ opacity }}
        >
          <source src={url} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
