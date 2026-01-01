
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
};

export default function FrameList({
  frames,
}: FrameProps) {
  return (
    <div className={styles.container}>
      {frames.map((frame) => <Frame key={frame.id} data={frame} />)}
    </div>
  )
}