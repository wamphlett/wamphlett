
import styles from './frame.module.css'
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
  data: FrameData;
};

export default function Frame({
  data,
}: FrameProps) {
  return (
    <div className={styles.container}>
      <div className='flex flex-column justify-between items-center'>
        <span className={styles.frameNumber}>#{data.frame_number}</span>
        <h2>{data.keyword}</h2>
      </div>

      { data.primitives && data.primitives.length > 0 &&
        <div className='flex flex-column justify-end items-center'>
          <span className={styles.primitives}><b>primitives</b>: {data.primitives?.join("... ")}</span>
        </div>
      }

      <div className='flex flex-column content-center'>
        <span className={styles.kanji}>{data.kanji}</span>
        <div className={styles.story}>
          {data.story ? <p dangerouslySetInnerHTML={{ __html: formatStory(data.story, data.keyword, data.components) }} /> : <p><i>No story provided yet.</i></p>}
          {data.comment && <span>{data.comment}</span>}
        </div>
      </div>

      <div className={'flex flex-column justify-between items-center ' + styles.details}>
        <div className='flex flex-column justify-start items-center'>
          <span className={styles.stokes}>[{data.stroke_count}]</span>
          <span className={styles.reading}><b>On</b>: {data.on_reading?.join(", ")}</span>
          <span className={styles.reading}><b>Kun</b>: {data.kun_reading?.join(", ")}</span>
        </div>
        <div className='flex flex-column justify-end items-center'>
          <span className={styles.chapter}>chapter: {data.chapter}</span>
          {data.jlpt && <span className={styles.jlpt + ' ' + styles['level_'+data.jlpt]}>{data.jlpt}</span> }
        </div>
      </div>
    </div>
  )
}

function formatStory(
  story: string,
  keyword: string,
  components: string[]
): string {
  if (!story || !keyword) return story;

  // Escape regex special characters
  const escape = (str: string): string =>
    str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Matches: keyword | keywords | keyword's (case-insensitive)
  const keywordRegex = new RegExp(
    `\\b(${escape(keyword)})(s|'s)?\\b`,
    "gi"
  );

  // Wrap keyword first
  let result: string = story.replace(keywordRegex, (match: string): string => {
    return `<b>${match}</b>`;
  });

  // Wrap components
  for (const component of components) {
    if (!component) continue;

    const componentRegex = new RegExp(
      `\\b(${escape(component)})(s|'s)?\\b`,
      "gi"
    );

    result = result.replace(
      componentRegex,
      (match: string): string => {
        // Avoid double-wrapping
        if (/<\/?(b|i)>/i.test(match)) return match;
        return `<i>${match}</i>`;
      }
    );
  }

  return result;
}