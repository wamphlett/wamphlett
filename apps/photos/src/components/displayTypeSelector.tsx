'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import styles from './displayTypeSelector.module.css';

interface DisplayTypeSelectorPros {
  onUpdate?: (columnNumber: number) => void;
}

export default function DisplayTypeSelector({
  onUpdate,
}: DisplayTypeSelectorPros) {
  const [current, setCurrent] = useState(3);

  let sliderClass = styles.slider;
  if (current == 1) {
    sliderClass += ` ${styles.right}`;
  }

  if (current == 3) {
    sliderClass += ` ${styles.left}`;
  }

  useEffect(() => {
    if (onUpdate) {
      onUpdate(current);
    }
  }, [current]);

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <Icon
          active={current == 3}
          columns={3}
          onClick={() => {
            setCurrent(3);
          }}
        />
        <Icon
          active={current == 2}
          columns={2}
          onClick={() => {
            setCurrent(2);
          }}
        />
        <Icon
          active={current == 1}
          columns={1}
          onClick={() => {
            setCurrent(1);
          }}
        />
        <div className={sliderClass} />
      </div>
    </div>
  );
}

interface iconProps {
  columns: number;
  active: boolean;
  onClick: () => void;
}

function Icon({ columns, onClick, active }: iconProps) {
  return (
    <div
      className={`${styles.icon} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.end} />
      {columns == 1 && (
        <div className={styles.one}>
          <div />
        </div>
      )}
      {columns == 2 && (
        <div className={styles.two}>
          <div />
          <div />
        </div>
      )}
      {columns == 3 && (
        <div className={styles.three}>
          <div />
          <div />
          <div />
        </div>
      )}
      <div className={styles.end} />
    </div>
  );
}
