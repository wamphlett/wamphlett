'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
      String(frame.frame_number) === q
    );
  }, [frames, query]);

  const listRef = useRef<HTMLDivElement>(null);
  const listOffsetRef = useRef(0);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  });

  const virtualizer = useWindowVirtualizer({
    count: filteredFrames.length,
    estimateSize: () => 260,
    overscan: 6,
    scrollMargin: listOffsetRef.current,
    getItemKey: (index) => filteredFrames[index].id,
  });

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
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
              <Frame data={filteredFrames[virtualRow.index]} token={token} />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>No kanji match &quot;{query}&quot;.</p>
      )}
    </div>
  )
}
