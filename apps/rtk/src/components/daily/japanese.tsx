'use client';
import { Fragment } from 'react';
import type {
  DictionaryEntry,
  KanjiInfo,
  KanjiStatus,
  Token,
} from '@/lib/daily/types';
import styles from './daily.module.css';

// Kanji I haven't studied are marked, and always show their reading.
export const STATUS_CLASS: Record<KanjiStatus, string> = {
  covered: '',
  not_studied: styles.notStudied,
  not_in_rtk: styles.outside,
};

type JapaneseTextProps = {
  tokens: Token[];
  kanji: Record<string, KanjiInfo>;
  targets: Record<string, true>;
  furigana: boolean;
  // Word taps: the selected word's key, and a callback. Without onSelect the
  // text isn't interactive.
  selected?: string;
  onSelect?: (key: string, surface: string) => void;
  idPrefix?: string;
};

export function JapaneseText({
  tokens,
  kanji,
  targets,
  furigana,
  selected,
  onSelect,
  idPrefix = '',
}: JapaneseTextProps) {
  return (
    <p className={styles.ja} lang="ja">
      {tokens.map((token, i) => {
        if (!token.parts.some(p => p.reading)) {
          return <Fragment key={i}>{token.surface}</Fragment>;
        }
        const key = `${idPrefix}${i}`;
        const isSelected = selected === key;
        const ruby = token.parts.map((part, j) =>
          part.reading ? (
            <ruby key={j}>
              {[...part.text].map((c, k) => (
                <span
                  className={`${targets[c] ? styles.target_ : ''} ${kanji[c] ? STATUS_CLASS[kanji[c].status] : ''}`}
                  key={k}
                >
                  {c}
                </span>
              ))}
              <rt
                className={
                  furigana ||
                  isSelected ||
                  [...part.text].some(
                    c => kanji[c] && kanji[c].status !== 'covered',
                  )
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
            onClick={() => onSelect(key, token.surface)}
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
  kanji,
  targets,
  bare = false,
}: {
  entry: DictionaryEntry;
  kanji: Record<string, KanjiInfo>;
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
        {entry.lemma !== entry.forms[0] && (
          <span className={`${styles.small} ${styles.muted}`} lang="ja">
            {' '}
            · from {entry.lemma}
          </span>
        )}
      </div>
      {entry.meanings.length > 0 && <div>{entry.meanings.join('; ')}</div>}
      <div className={styles.kanjiList}>
        {entry.wholeWordReading && (
          <span className={`${styles.chip} ${styles.info}`}>
            whole-word reading (jukujikun): the kanji don&apos;t read separately
            here
          </span>
        )}
        {entry.kanji.map(k => {
          const info = kanji[k.kanji];
          return (
            <div className={styles.kanjiLine} key={k.kanji}>
              <b className={targets[k.kanji] ? styles.target_ : ''} lang="ja">
                {k.kanji}
              </b>
              <span lang="ja">{k.reading ?? ''}</span>
              <span>
                {info?.status === 'covered' ? (
                  <a href={`/#${info.frame}`}>
                    #{info.frame} {info.keyword}
                  </a>
                ) : info?.status === 'not_studied' ? (
                  <span className={`${styles.chip} ${styles.info}`}>
                    not studied yet
                  </span>
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
