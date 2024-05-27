'use client'
import React, { useState, useRef, useEffect, useCallback } from "react";

import styles from './pill.module.css';

interface PillPros {
  tags: string[];
  name: string;
  active: boolean;
  onClick?: () => void;
}


export default function Pill({ name, tags, onClick, active = false }: PillPros) {
  return (
    <div className={`${styles.container} ${active ? styles.active : ''}`} onClick={onClick}>
      {name}
    </div>
  );
}
