'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";

import styles from './displayTypeSelector.module.css';

interface  DisplayTypeSelectorPros {
  onUpdate?: (columnNumber: number) => void;
}


export default function DisplayTypeSelector({ onUpdate }: DisplayTypeSelectorPros) {
  const [current, setCurrent] = useState(3);

  let sliderClass = styles.slider;
  if (current == 1) {
    sliderClass += ` ${styles.right}`
  }

  if (current == 3) {
    sliderClass += ` ${styles.left}`
  }

  useEffect(() => {
    if (onUpdate) {
      onUpdate(current);
    }
  }, [current]);
  
  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <Icon columns={3} active={current == 3} onClick={() => {setCurrent(3)}} />
        <Icon columns={2} active={current == 2} onClick={() => {setCurrent(2)}} />
        <Icon columns={1} active={current == 1} onClick={() => {setCurrent(1)}} />
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

function Icon({ columns, onClick, active }:  iconProps) {
  return (
    <div className={ `${styles.icon} ${active ? styles.active : ''}` } onClick={onClick}>
      <div className={styles.end} />
      {columns == 1 && (
        <div className={styles.one}>
          <div />
        </div>
      )}
      {columns == 2 &&  (
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