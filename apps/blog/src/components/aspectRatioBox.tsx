import React from 'react';
import styles from './aspectRatioBox.module.css';

type AspectRatioBoxProps = {
  aspectRatio?: number;
  borderRadius?: number;
  children: React.ReactNode;
};

export default function AspectRatioBox({
  aspectRatio = 1,
  borderRadius = 0,
  children,
}: AspectRatioBoxProps) {
  return (
    <div
      className={styles.box}
      style={{
        paddingBottom: 100 / aspectRatio + '%',
        borderRadius: borderRadius,
      }}
    >
      <div className={styles.content}>{children}</div>
    </div>
  );
}
