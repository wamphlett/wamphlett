'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDay, formatTime, percent } from '@/lib/daily/format';
import { parseJapanese } from '@/lib/daily/text';
import type {
  Comment,
  DailyEntry as Entry,
  Grade,
  Reason,
} from '@/lib/daily/types';
import { DictionaryItem, JapaneseText } from './japanese';
import styles from './daily.module.css';

type DailyEntryProps = {
  entry: Entry;
  prevDate?: string;
  nextDate?: string;
  loggedIn: boolean;
};

const GRADES: { grade: Grade; label: string; tone: string }[] = [
  { grade: 'read', label: 'Read it', tone: styles.ok },
  { grade: 'furigana', label: 'Needed furigana', tone: styles.info },
  { grade: 'stuck', label: "Couldn't read it", tone: styles.warn },
];

function reasonLabel({ code, value }: Reason): string {
  switch (code) {
    case 'again_yesterday':
      return value === 1
        ? 'failed once yesterday'
        : `failed ${value} times yesterday`;
    case 'lapses_14d':
      return `${value} lapses in 14 days`;
    case 'low_stability':
      return `stability ${value} days`;
    case 'leech':
      return 'leech';
    case 'reading_struggle':
      return 'hard to read lately';
  }
}

const plainText = (markup: string) =>
  parseJapanese(markup)
    .map(s => (s.kind === 'text' ? s.text : s.surface))
    .join('');

export default function DailyEntry({
  entry,
  prevDate,
  nextDate,
  loggedIn,
}: DailyEntryProps) {
  const [asMe, setAsMe] = useState(loggedIn);
  const [done, setDone] = useState(entry.done);
  const [grades, setGrades] = useState<Record<string, Grade>>(entry.grades);
  const [hiddenSentences, setHiddenSentences] = useState<Record<string, true>>(
    {},
  );
  const [entryHidden, setEntryHidden] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [comments, setComments] = useState<Comment[]>(entry.comments);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<{ id: string; body: string } | null>(
    null,
  );
  const [furigana, setFurigana] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, true>>({});
  const [selected, setSelected] = useState<{
    key: string;
    surface: string;
  } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const targets: Record<string, true> = Object.fromEntries(
    entry.targets.map(t => [t.kanji, true]),
  );
  const base = `/daily/${entry.date}`;
  // Every action would be one rtk-api call; the mock only shows which.
  const mock = (call: string) => setToast(`Mock: would send ${call}`);
  const toggle = (key: string) =>
    setRevealed(r => {
      const next = { ...r };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  const select = (key: string, surface: string) =>
    setSelected(s => (s?.key === key ? null : { key, surface }));
  const lookup = (surface: string) =>
    entry.dictionary.find(e => e.forms.includes(surface));

  const wordDetail = (prefix: string) => {
    if (!selected?.key.startsWith(prefix)) {
      return null;
    }
    const found = lookup(selected.surface);
    return (
      <div className={styles.wordDetail}>
        {found ? (
          <>
            <DictionaryItem bare entry={found} targets={targets} />
            <a
              className={`${styles.small} ${styles.muted}`}
              href={`#word-${found.forms[0]}`}
            >
              See it in the dictionary
            </a>
          </>
        ) : (
          <span className={styles.muted}>Not in today&apos;s dictionary.</span>
        )}
      </div>
    );
  };

  const furiganaToggle = (section: string) => (
    <button
      className={`${styles.darkButton} ${furigana[section] ? styles.active : ''}`}
      onClick={() => setFurigana(f => ({ ...f, [section]: !f[section] }))}
      type="button"
    >
      Furigana {furigana[section] ? 'on' : 'off'}
    </button>
  );

  const { stats } = entry;
  const visibleSentences = entry.sentences.filter(
    s => asMe || !hiddenSentences[s.id],
  );

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          Daily reading<span>.</span>
        </h1>
        <span className={styles.subtitle}>{formatDay(entry.date)}</span>
        <span className={styles.intro}>
          Homework built from the kanji I struggled with in yesterday&apos;s
          Anki reviews: real sentences to read, a short passage, and one to
          write by hand. Tap any word for its reading.
        </span>
        <div className={styles.nav}>
          <Link href="/daily">All entries</Link>
          {prevDate && (
            <Link href={`/daily/${prevDate}`}>
              Previous: {formatDay(prevDate, 'short')}
            </Link>
          )}
          {nextDate && (
            <Link href={`/daily/${nextDate}`}>
              Next: {formatDay(nextDate, 'short')}
            </Link>
          )}
          <Link href="/">All frames</Link>
        </div>
      </div>

      <div className={styles.banner}>
        <b>Mock.</b> Everything on this page is example data, and nothing is
        saved: actions only show the rtk-api call they would make. Every date
        shows the same entry.
      </div>

      {entryHidden && (
        <div className={styles.banner}>
          This entry is hidden. Visitors get a 404; only you can see it.
        </div>
      )}

      <div className={`${styles.card} ${styles.spread}`}>
        <div className={styles.row}>
          <span className={`${styles.chip} ${done ? styles.statusDone : ''}`}>
            {done ? 'Done' : 'Not done yet'}
          </span>
          <span className={`${styles.small} ${styles.muted}`}>
            Generated {formatTime(entry.generatedAt)} from{' '}
            {formatDay(entry.studyDate, 'short')}&apos;s reviews
          </span>
          {regenerating && (
            <span className={`${styles.chip} ${styles.info}`}>
              Regeneration queued
            </span>
          )}
        </div>
        {asMe && (
          <div className={styles.row}>
            <button
              className={`${styles.button} ${done ? styles.active : ''}`}
              onClick={() => {
                setDone(!done);
                mock(`POST ${base}/done {"done":${!done}}`);
              }}
              type="button"
            >
              {done ? 'Done' : 'Mark as done'}
            </button>
            <button
              className={`${styles.button} ${styles.quiet}`}
              disabled={regenerating}
              onClick={() => {
                if (
                  window.confirm(
                    'Regenerate this entry? Sentence grades are lost. Comments, done and hidden sentences are kept.',
                  )
                ) {
                  setRegenerating(true);
                  mock(`POST ${base}/regenerate`);
                }
              }}
              type="button"
            >
              Regenerate
            </button>
            <button
              className={`${styles.button} ${styles.quiet}`}
              onClick={() => {
                setEntryHidden(!entryHidden);
                mock(
                  `PATCH ${base} {"status":"${entryHidden ? 'published' : 'hidden'}"}`,
                );
              }}
              type="button"
            >
              {entryHidden ? 'Unhide entry' : 'Hide entry'}
            </button>
          </div>
        )}
      </div>

      <h2 className={styles.sectionTitle}>
        Yesterday&apos;s study
        <small>{formatDay(entry.studyDate)}</small>
      </h2>
      <div className={styles.stats}>
        {[
          [stats.reviews, 'reviews'],
          [stats.minutes, 'minutes'],
          [percent(stats.againRate), 'answered Again'],
          [stats.newKanji, 'new kanji'],
        ].map(([value, label]) => (
          <div className={styles.stat} key={label}>
            <span className={styles.statValue}>{value}</span>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
      <div className={styles.twoCol}>
        <div className={styles.card}>
          <div className={styles.spread}>
            <b>Weekly true retention</b>
            <span className={`${styles.small} ${styles.muted}`}>
              line: 90% target
            </span>
          </div>
          <div className={styles.bars} style={{ marginTop: 12 }}>
            {stats.weeklyRetention.flatMap(week =>
              (['recall', 'recognition'] as const).map(kind => (
                <Bar
                  color={kind === 'recall' ? '#5fa3d6' : '#f2b441'}
                  key={week.week + kind}
                  label={
                    kind === 'recall'
                      ? `w/c ${formatDay(week.week, 'short').replace(/^\w+ /, '')}`
                      : ''
                  }
                  target={0.9}
                  value={week[kind]}
                />
              )),
            )}
          </div>
          <div
            className={`${styles.row} ${styles.small}`}
            style={{ marginTop: 10 }}
          >
            <span style={{ color: '#5fa3d6' }}>■ Recall</span>
            <span style={{ color: '#f2b441' }}>■ Recognition</span>
          </div>
        </div>
        <div className={styles.card}>
          <b>Again rate</b>
          <div className={styles.bars} style={{ marginTop: 12 }}>
            <Bar color="#b3261e" label="Recall" value={stats.recallAgainRate} />
            <Bar
              color="#b3261e"
              label="Recognition"
              value={stats.recognitionAgainRate}
            />
          </div>
          <b style={{ display: 'block', marginTop: 18 }}>Weakest lessons</b>
          <div className={styles.bars} style={{ marginTop: 12 }}>
            {stats.weakestLessons.map(l => (
              <Bar
                color="#b3261e"
                key={l.lesson}
                label={`Lesson ${l.lesson}`}
                value={l.againRate}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.card} style={{ marginTop: 10 }}>
        <div className={styles.row}>
          <b>Where I am</b>
          <span className={styles.aiLabel}>AI summary</span>
        </div>
        <p className={styles.summary}>{entry.summary}</p>
        <span className={`${styles.small} ${styles.muted}`}>
          Written by {entry.model} from the numbers above only.
        </span>
      </div>

      <h2 className={styles.sectionTitle}>
        Today&apos;s kanji
        <small>picked from yesterday&apos;s weak spots</small>
      </h2>
      <div className={styles.targets}>
        {entry.targets.map(t => (
          <div className={styles.target} key={t.kanji}>
            <div className={styles.targetHead}>
              <span className={styles.targetKanji} lang="ja">
                {t.kanji}
              </span>
              <div>
                <a className={styles.muted} href={`/#${t.frame}`}>
                  #{t.frame}
                </a>
                <span className={styles.targetKeyword}>{t.keyword}</span>
              </div>
            </div>
            <div className={styles.row}>
              {t.reasons.map(r => (
                <span
                  className={`${styles.chip} ${
                    r.code === 'leech' || r.code === 'again_yesterday'
                      ? styles.warn
                      : styles.info
                  }`}
                  key={r.code}
                >
                  {reasonLabel(r)}
                </span>
              ))}
            </div>
            <div className={styles.story}>
              {t.story ? (
                <p>{t.story}</p>
              ) : (
                <p>
                  <i>No story yet.</i>{' '}
                  {asMe && <a href={`/#${t.frame}`}>Write one</a>}
                </p>
              )}
              {t.comment && (
                <p className={`${styles.small} ${styles.muted}`}>{t.comment}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 className={`${styles.sectionTitle} ${styles.spread}`}>
        <span>
          Sentences
          <small>every other kanji is one I&apos;ve already studied</small>
        </span>
        {furiganaToggle('sentences')}
      </h2>
      <div className={styles.card}>
        {visibleSentences.map(s => {
          const prefix = `${s.id}:`;
          const position = entry.sentences.indexOf(s) + 1;
          if (hiddenSentences[s.id]) {
            return (
              <div
                className={`${styles.sentence} ${styles.hiddenSentence}`}
                key={s.id}
              >
                <span>
                  Hidden sentence: {plainText(s.text)}{' '}
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    onClick={() => {
                      setHiddenSentences(h => {
                        const next = { ...h };
                        delete next[s.id];
                        return next;
                      });
                      mock(`DELETE ${base}/sentences/${position}/hide`);
                    }}
                    type="button"
                  >
                    Undo
                  </button>
                </span>
              </div>
            );
          }
          const grade = grades[s.id];
          const gradeInfo = GRADES.find(g => g.grade === grade);
          return (
            <div className={styles.sentence} key={s.id}>
              <JapaneseText
                furigana={!!furigana.sentences}
                idPrefix={prefix}
                markup={s.text}
                onSelect={select}
                selected={selected?.key}
                targets={targets}
              />
              {wordDetail(prefix)}
              {revealed[s.id] && (
                <span className={styles.translation}>{s.translation}</span>
              )}
              <div className={styles.spread}>
                <div className={styles.row}>
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    onClick={() => toggle(s.id)}
                    type="button"
                  >
                    {revealed[s.id] ? 'Hide translation' : 'Show translation'}
                  </button>
                  <span className={`${styles.small} ${styles.muted}`}>
                    {s.source === 'tatoeba' ? (
                      <a
                        href={`https://tatoeba.org/en/sentences/search?from=jpn&query=${encodeURIComponent(plainText(s.text))}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Tatoeba · {s.owner}
                      </a>
                    ) : (
                      <span className={styles.aiLabel}>AI-written</span>
                    )}
                  </span>
                </div>
                {asMe ? (
                  <div className={styles.row}>
                    {GRADES.map(g => (
                      <button
                        className={`${styles.button} ${grade === g.grade ? styles.active : styles.quiet}`}
                        key={g.grade}
                        onClick={() => {
                          setGrades(gs => ({ ...gs, [s.id]: g.grade }));
                          mock(
                            `PUT ${base}/grades/${position} {"grade":"${g.grade}"}`,
                          );
                        }}
                        type="button"
                      >
                        {g.label}
                      </button>
                    ))}
                    <button
                      className={`${styles.button} ${styles.quiet}`}
                      onClick={() => {
                        setHiddenSentences(h => ({ ...h, [s.id]: true }));
                        mock(`POST ${base}/sentences/${position}/hide`);
                      }}
                      title="Hide this sentence and never show it again"
                      type="button"
                    >
                      Hide
                    </button>
                  </div>
                ) : (
                  gradeInfo && (
                    <span className={`${styles.chip} ${gradeInfo.tone}`}>
                      {gradeInfo.label}
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {entry.passage && (
        <>
          <h2 className={`${styles.sectionTitle} ${styles.spread}`}>
            <span>
              A short reading
              <small>written for today&apos;s kanji</small>
            </span>
            {furiganaToggle('passage')}
          </h2>
          <div className={`${styles.card} ${styles.passage}`}>
            <JapaneseText
              furigana={!!furigana.passage}
              idPrefix="passage:"
              markup={entry.passage.text}
              onSelect={select}
              selected={selected?.key}
              targets={targets}
            />
            {wordDetail('passage:')}
            {revealed.passage && (
              <p className={styles.translation} style={{ marginTop: 10 }}>
                {entry.passage.translation}
              </p>
            )}
            <div className={styles.row} style={{ marginTop: 12 }}>
              <button
                className={`${styles.button} ${styles.quiet}`}
                onClick={() => toggle('passage')}
                type="button"
              >
                {revealed.passage ? 'Hide translation' : 'Show translation'}
              </button>
              <span className={styles.aiLabel}>AI-written</span>
              <span className={`${styles.small} ${styles.muted}`}>
                checked by code: every kanji studied, every target used
              </span>
            </div>
          </div>
        </>
      )}

      <h2 className={styles.sectionTitle}>
        Write it
        <small>by hand, with kanji, before you reveal</small>
      </h2>
      {entry.writing.map(w => (
        <div className={styles.card} key={w.id}>
          <p style={{ fontSize: '1.4em', fontWeight: 600 }}>{w.prompt}</p>
          <p
            className={`${styles.small} ${styles.muted}`}
            style={{ marginTop: 4 }}
          >
            Uses{' '}
            {w.uses
              .map(k => {
                const t = entry.targets.find(t => t.kanji === k);
                return t ? `${k} (${t.keyword})` : k;
              })
              .join(', ')}
          </p>
          {revealed[w.id] && (
            <>
              <JapaneseText
                furigana={!!furigana.writing}
                idPrefix={`${w.id}:`}
                markup={w.answer}
                onSelect={select}
                selected={selected?.key}
                targets={targets}
              />
              {wordDetail(`${w.id}:`)}
            </>
          )}
          <div className={styles.row} style={{ marginTop: 12 }}>
            <button
              className={`${styles.button} ${revealed[w.id] ? styles.quiet : styles.accent}`}
              onClick={() => toggle(w.id)}
              type="button"
            >
              {revealed[w.id] ? 'Hide answer' : 'Show answer'}
            </button>
            {revealed[w.id] && (
              <button
                className={`${styles.button} ${styles.quiet}`}
                onClick={() =>
                  setFurigana(f => ({ ...f, writing: !f.writing }))
                }
                type="button"
              >
                Furigana {furigana.writing ? 'on' : 'off'}
              </button>
            )}
          </div>
        </div>
      ))}

      <h2 className={styles.sectionTitle}>
        Dictionary
        <small>every word above, with the reading it has here</small>
      </h2>
      <div className={styles.legend}>
        <span>
          <b className={styles.target_}>府</b> a target kanji for today
        </span>
        <span>
          <span className={styles.outside}>嘘</span> not in RTK, so its reading
          always shows
        </span>
      </div>
      <div className={styles.dictionary}>
        {entry.dictionary.map(d => (
          <DictionaryItem entry={d} key={d.forms[0]} targets={targets} />
        ))}
      </div>
      <p className={`${styles.small}`} style={{ marginTop: 10, opacity: 0.7 }}>
        Meanings from JMdict (EDRDG, CC BY-SA 4.0). Sentences from Tatoeba (CC
        BY 2.0 FR). Readings from UniDic, never from the AI.
      </p>

      <h2 className={styles.sectionTitle}>Comments</h2>
      <div className={styles.card}>
        {comments.length === 0 && (
          <p className={styles.muted}>No comments yet.</p>
        )}
        {comments.map(c => (
          <div className={styles.comment} key={c.id}>
            <div className={`${styles.small} ${styles.muted}`}>
              Warren · {formatTime(c.createdAt)}
              {c.updatedAt && ' · edited'}
            </div>
            {editing?.id === c.id ? (
              <>
                <textarea
                  className={styles.textarea}
                  onChange={e => setEditing({ id: c.id, body: e.target.value })}
                  value={editing.body}
                />
                <div className={styles.row}>
                  <button
                    className={styles.button}
                    disabled={!editing.body.trim()}
                    onClick={() => {
                      setComments(cs =>
                        cs.map(x =>
                          x.id === c.id
                            ? {
                                ...x,
                                body: editing.body.trim(),
                                updatedAt: new Date().toISOString(),
                              }
                            : x,
                        ),
                      );
                      setEditing(null);
                      mock(`PATCH ${base}/comments/${c.id}`);
                    }}
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    onClick={() => setEditing(null)}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p style={{ whiteSpace: 'pre-wrap' }}>{c.body}</p>
            )}
            {asMe && editing?.id !== c.id && (
              <div className={styles.row} style={{ marginTop: 6 }}>
                <button
                  className={`${styles.button} ${styles.quiet}`}
                  onClick={() => setEditing({ id: c.id, body: c.body })}
                  type="button"
                >
                  Edit
                </button>
                <button
                  className={`${styles.button} ${styles.quiet}`}
                  onClick={() => {
                    setComments(cs => cs.filter(x => x.id !== c.id));
                    mock(`DELETE ${base}/comments/${c.id}`);
                  }}
                  type="button"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
        {asMe && (
          <div style={{ marginTop: comments.length ? 18 : 0 }}>
            <textarea
              className={styles.textarea}
              onChange={e => setDraft(e.target.value)}
              placeholder="How did today go?"
              value={draft}
            />
            <button
              className={styles.button}
              disabled={!draft.trim()}
              onClick={() => {
                setComments(cs => [
                  ...cs,
                  {
                    id: `c${Date.now()}`,
                    body: draft.trim(),
                    createdAt: new Date().toISOString(),
                  },
                ]);
                setDraft('');
                mock(`POST ${base}/comments`);
              }}
              type="button"
            >
              Post comment
            </button>
          </div>
        )}
      </div>

      {asMe && (
        <div
          className={`${styles.card} ${styles.spread}`}
          style={{ marginTop: 24 }}
        >
          <b>{done ? 'Done for today.' : 'Finished the homework?'}</b>
          <button
            className={`${styles.button} ${done ? styles.active : styles.accent}`}
            onClick={() => {
              setDone(!done);
              mock(`POST ${base}/done {"done":${!done}}`);
            }}
            type="button"
          >
            {done ? 'Done' : 'Mark as done'}
          </button>
        </div>
      )}

      <div className={styles.mockBar}>
        <span style={{ opacity: 0.7 }}>Mock · view as</span>
        <button
          className={`${styles.darkButton} ${asMe ? '' : styles.active}`}
          onClick={() => setAsMe(false)}
          type="button"
        >
          Visitor
        </button>
        <button
          className={`${styles.darkButton} ${asMe ? styles.active : ''}`}
          onClick={() => setAsMe(true)}
          type="button"
        >
          Me, logged in
        </button>
      </div>
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  );
}

function Bar({
  label,
  value,
  color,
  target,
}: {
  label: string;
  value: number;
  color: string;
  target?: number;
}) {
  return (
    <>
      <span>{label}</span>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: percent(value), background: color }}
        />
        {target !== undefined && (
          <div className={styles.barTarget} style={{ left: percent(target) }} />
        )}
      </div>
      <span>{percent(value)}</span>
    </>
  );
}
