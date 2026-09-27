'use client';
import { Fragment } from 'react';
import { KANJI } from '@/lib/daily/kanji';
import { parseJapanese } from '@/lib/daily/text';
import type { DictionaryEntry } from '@/lib/daily/types';
import styles from './daily.module.css';

type JapaneseTextProps = {
  markup: string;
  targets: Record<string, true>;
  furigana: boolean;
  // Word taps: the selected word's key, and a callback. Without onSelect the
  // text isn't interactive.
  selected?: string;
  onSelect?: (key: string, surface: string) => void;
  idPrefix?: string;
};

// Kanji outside RTK always show their reading.
const outsideRtk = (text: string) => [...text].some(c => !KANJI[c]);

export function JapaneseText({
  markup,
  targets,
  furigana,
  selected,
  onSelect,
  idPrefix = '',
}: JapaneseTextProps) {
  return (
    <p className={styles.ja} lang="ja">
      {parseJapanese(markup).map((segment, i) => {
        if (segment.kind === 'text') {
          return <Fragment key={i}>{segment.text}</Fragment>;
        }
        const key = `${idPrefix}${i}`;
        const isSelected = selected === key;
        const ruby = segment.parts.map((part, j) =>
          part.reading ? (
            <ruby key={j}>
              {[...part.text].map((c, k) => (
                <span
                  className={`${targets[c] ? styles.target_ : ''} ${KANJI[c] ? '' : styles.outside}`}
                  key={k}
                >
                  {c}
                </span>
              ))}
              <rt
                className={
                  furigana || isSelected || outsideRtk(part.text)
                    ? ''
                    : styles.hidden
                }
              >
                {part.reading}
              </rt>
            </ruby>
          ) : (
            <Fragment key={j}>{part.text}</Fragment>
          ),
        );
        return onSelect ? (
          <button
            className={`${styles.word} ${isSelected ? styles.selected : ''}`}
            key={i}
            onClick={() => onSelect(key, segment.surface)}
            type="button"
          >
            {ruby}
          </button>
        ) : (
          <Fragment key={i}>{ruby}</Fragment>
        );
      })}
    </p>
  );
}

export function DictionaryItem({
  entry,
  targets,
  bare = false,
}: {
  entry: DictionaryEntry;
  targets: Record<string, true>;
  // Inside a sentence's word detail: no card chrome.
  bare?: boolean;
}) {
  const isTarget = entry.kanji.some(k => targets[k.kanji]);
  return (
    <div
      className={
        bare ? '' : `${styles.entry} ${isTarget ? styles.targetEntry : ''}`
      }
      id={bare ? undefined : `word-${entry.forms[0]}`}
    >
      <div>
        <span className={styles.entryWord} lang="ja">
          {entry.forms[0]}
        </span>
        <span className={styles.entryReading} lang="ja">
          {entry.reading}
        </span>
        {entry.lemma && (
          <span className={`${styles.small} ${styles.muted}`} lang="ja">
            {' '}
            · from {entry.lemma}
          </span>
        )}
      </div>
      <div>{entry.meanings.join('; ')}</div>
      <div className={styles.kanjiList}>
        {entry.wholeWordReading && (
          <span className={`${styles.chip} ${styles.info}`}>
            whole-word reading (jukujikun): the kanji don&apos;t read separately
            here
          </span>
        )}
        {entry.kanji.map(k => {
          const frame = KANJI[k.kanji];
          return (
            <div className={styles.kanjiLine} key={k.kanji}>
              <b className={targets[k.kanji] ? styles.target_ : ''} lang="ja">
                {k.kanji}
              </b>
              <span lang="ja">{k.reading ?? ''}</span>
              <span>
                {frame ? (
                  <a href={`/#${frame.frame}`}>
                    #{frame.frame} {frame.keyword}
                  </a>
                ) : (
                  <span className={`${styles.chip} ${styles.warn}`}>
                    not in RTK
                  </span>
                )}
                {k.note && (
                  <span className={styles.muted} lang="ja">
                    {' '}
                    · {k.note}
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
