'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import styles from './frameList.module.css';
// {
// 			"id": "6955999aa2579eaa06caf090",
// 			"frame_number": 1,
// 			"keyword": "one",
// 			"primitives": [
// 				"floor",
// 				"ceiling"
// 			],
// 			"stroke_count": 1,
// 			"kanji": "一",
// 			"components": [],
// 			"story": "",
// 			"is_primitive_only": false,
// 			"chapter": 1
// 		},

import Frame from "./frame";

type FrameData = {
  id: string;
  frame_number: number;
  keyword: string;
  chapter: number;
  story: string;
  kanji: string;
  comment?: string;
  on_reading?: string[];
  kun_reading?: string[];
  stroke_count: number;
  jlpt?: string;
  primitives?: string[];
  components: string[];
};

type FrameProps = {
  frames: FrameData[];
  token?: string;
};

export default function FrameList({
  frames,
  token,
}: FrameProps) {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handle = setTimeout(() => setQuery(inputValue), 150);
    return () => clearTimeout(handle);
  }, [inputValue]);

  const filteredFrames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frames;

    return frames.filter((frame) =>
      frame.kanji.includes(query.trim()) ||
      frame.keyword.toLowerCase().split(/[\s-]+/).some((word) => word.startsWith(q)) ||
      frame.primitives?.some((primitive) => primitive.toLowerCase().split(/[\s-]+/).some((word) => word.startsWith(q))) ||
      String(frame.frame_number) === q
    );
  }, [frames, query]);

  const listRef = useRef<HTMLDivElement>(null);
  const listOffsetRef = useRef(0);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  });

  const getObstructionHeight = useCallback(() => {
    if (!searchBarRef.current) return 0;
    const stickyTop = parseFloat(getComputedStyle(searchBarRef.current).top) || 0;
    return stickyTop + searchBarRef.current.offsetHeight;
  }, []);

  const virtualizer = useWindowVirtualizer({
    count: filteredFrames.length,
    estimateSize: () => 260,
    overscan: 6,
    scrollMargin: listOffsetRef.current,
    getItemKey: (index) => filteredFrames[index].id,
  });

  const handleComponentClick = useCallback((component: string) => {
    const normalized = component.trim().toLowerCase();

    let index = frames.findIndex((frame) => frame.keyword.toLowerCase() === normalized);
    if (index === -1) {
      index = frames.findIndex((frame) =>
        frame.primitives?.some((primitive) => primitive.toLowerCase() === normalized)
      );
    }
    if (index === -1) return;

    flushSync(() => {
      setInputValue('');
      setQuery('');
    });

    // react-virtual only self-corrects its target for rows that were still
    // at an estimated (unmeasured) height while a scroll is "auto" — that
    // correction is explicitly skipped once behavior is "smooth", since
    // adjusting the destination mid-CSS-animation would look glitchy. So a
    // plain smooth scrollToIndex/scrollToOffset can land short by however
    // many rows between here and the target hadn't been measured yet.
    //
    // Instead, drive the animation ourselves: each frame, recompute the true
    // target via an instant (self-correcting) jump and ease window.scrollTo
    // toward it. As the animation gets physically closer to the target, more
    // of the intervening rows render and get measured for real, so the
    // computed target keeps converging on the accurate value — the same
    // self-correction "auto" mode gets, just spread continuously across a
    // smooth-looking motion instead of applied once.
    const startY = window.scrollY;
    const startTime = performance.now();
    const DURATION = 500;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const getTarget = () => {
      virtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' });
      const y = Math.max(window.scrollY - getObstructionHeight(), 0);
      window.scrollTo(0, startY);
      return y;
    };

    const step = () => {
      const t = Math.min((performance.now() - startTime) / DURATION, 1);
      const target = getTarget();
      window.scrollTo(0, startY + (target - startY) * easeOutCubic(t));

      if (t < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [frames, virtualizer, getObstructionHeight]);

  return (
    <div className={styles.container}>
      <div ref={searchBarRef} className={styles.searchBar}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by kanji, number, or keyword..."
          className={styles.searchInput}
        />
      </div>

      {filteredFrames.length > 0 ? (
        <div ref={listRef} style={{ position: 'relative', width: '100%', height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                overflow: 'hidden',
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <Frame data={filteredFrames[virtualRow.index]} token={token} onComponentClick={handleComponentClick} />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>No kanji match &quot;{query}&quot;.</p>
      )}
    </div>
  )
}
