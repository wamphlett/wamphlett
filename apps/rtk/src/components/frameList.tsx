'use client';

import { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');

  const filteredFrames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return frames;

    return frames.filter((frame) =>
      frame.kanji.includes(query.trim()) ||
      frame.keyword.toLowerCase().includes(q) ||
      String(frame.frame_number).includes(q)
    );
  }, [frames, query]);

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by kanji, number, or keyword..."
          className={styles.searchInput}
        />
      </div>

      {filteredFrames.length > 0
        ? filteredFrames.map((frame) => <Frame key={frame.id} data={frame} token={token} />)
        : <p className={styles.noResults}>No kanji match &quot;{query}&quot;.</p>
      }
    </div>
  )
}