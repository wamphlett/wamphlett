'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './seriesPill.module.css';
import { Series } from '@/util/API';
import SeriesSteps from './seriesSteps';

type SeriesPillProps = {
  series: Series;
  currentSlug: string;
};

export default function SeriesPill({ series, currentSlug }: SeriesPillProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seriesIndex = series.articles.findIndex(a => a.slug === currentSlug);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && containerRef.current) {
        if (
          !(event.target instanceof Node) ||
          !containerRef.current.contains(event.target)
        ) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [open]);

  if (seriesIndex < 0) {
    return null;
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        className={styles.pill}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        Part {seriesIndex + 1} of {series.articles.length} &middot;{' '}
        {series.name}
      </button>

      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`}
        onClick={() => setOpen(false)}
      />

      <div className={`${styles.popover} ${open ? styles.open : ''}`}>
        <span className={styles.popoverLabel}>{series.name}</span>
        <SeriesSteps
          series={series}
          currentSlug={currentSlug}
          onCurrentClick={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
