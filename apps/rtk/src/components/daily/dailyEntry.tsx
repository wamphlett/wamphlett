'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import { formatDay, formatTime, percent } from '@/lib/daily/format';
import { type ApiComment, fromComment } from '@/lib/daily/payload';
import type {
  Comment,
  DailyEntry as Entry,
  Grade,
  KanjiStatus,
  Reason,
  Token,
} from '@/lib/daily/types';
import { DictionaryItem, JapaneseText, STATUS_CLASS } from './japanese';
import styles from './daily.module.css';

type DailyEntryProps = {
  entry: Entry;
  prevDate?: string;
  nextDate?: string;
  // A valid login: shows the actions, which send it to rtk-api.
  token?: string;
};

// Why an action failed, shown where it was made. expired: rtk-api answered
// 401, so the fix is to log in again.
type ActionError = { message: string; expired: boolean };

class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

function without<T>(record: Record<string, T>, key: string) {
  const next = { ...record };
  delete next[key];
  return next;
}

const byCreated = (a: Comment, b: Comment) =>
  a.createdAt.localeCompare(b.createdAt) || a.id - b.id;

const GRADES: { grade: Grade; label: string; tone: string }[] = [
  { grade: 'read', label: 'Read it', tone: styles.ok },
  { grade: 'furigana', label: 'Needed furigana', tone: styles.info },
  { grade: 'stuck', label: "Couldn't read it", tone: styles.warn },
];

function reasonLabel({ code, value }: Reason): string {
  switch (code) {
    case 'again_yesterday':
      return value === null
        ? 'failed yesterday'
        : value === 1
          ? 'failed once yesterday'
          : `failed ${value} times yesterday`;
    case 'lapses_14d':
      return value === null
        ? 'lapses in 14 days'
        : `${value} ${value === 1 ? 'lapse' : 'lapses'} in 14 days`;
    case 'low_stability':
      return value === null ? 'low stability' : `stability ${value} days`;
    case 'leech':
      return 'leech';
    case 'reading_struggle':
      return 'hard to read lately';
  }
}

const plainText = (tokens: Token[]) => tokens.map(t => t.surface).join('');

const LEGEND: { status: KanjiStatus; label: string }[] = [
  {
    status: 'not_studied',
    label: 'not studied yet, so its reading always shows',
  },
  { status: 'not_in_rtk', label: 'not in RTK, so its reading always shows' },
];

export default function DailyEntry({
  entry,
  prevDate,
  nextDate,
  token,
}: DailyEntryProps) {
  const loggedIn = !!token;
  const { apiUrl } = useRuntimeConfig();
  const [done, setDone] = useState(entry.done);
  const [doneAt, setDoneAt] = useState(entry.doneAt);
  const [grades, setGrades] = useState<Record<string, Grade>>(entry.grades);
  // Keyed by sentence position.
  const [hiddenSentences, setHiddenSentences] = useState<Record<string, true>>(
    () =>
      Object.fromEntries(
        entry.sentences.filter(s => s.hidden).map(s => [s.position, true]),
      ),
  );
  const [status, setStatus] = useState(entry.status);
  const [regenerateQueued, setRegenerateQueued] = useState(
    entry.regenerateRequested,
  );
  const [comments, setComments] = useState<Comment[]>(entry.comments);
  const [draft, setDraft] = useState('');
  const [editing, setEditing] = useState<{ id: number; body: string } | null>(
    null,
  );
  const [furigana, setFurigana] = useState<Record<string, boolean>>({});
  const [revealed, setRevealed] = useState<Record<string, true>>({});
  const [selected, setSelected] = useState<{
    key: string;
    surface: string;
  } | null>(null);
  // Actions waiting for rtk-api, and the last failure where each was made.
  const [pending, setPending] = useState<Record<string, true>>({});
  const [errors, setErrors] = useState<Record<string, ActionError>>({});

  const targets: Record<string, true> = Object.fromEntries(
    entry.targets.map(t => [t.kanji, true]),
  );
  const toggle = (key: string) =>
    setRevealed(r => (r[key] ? without(r, key) : { ...r, [key]: true }));

  // One action on this entry. Resolves to the JSON reply, or null for a 204.
  async function send<T = null>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    if (!apiUrl) {
      throw new ApiError('The page is still loading. Try again.', 0);
    }
    let res: Response;
    try {
      res = await fetch(`${apiUrl}/reading/${entry.date}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError("Couldn't reach the server. Try again.", 0);
    }
    if (res.status === 401) {
      throw new ApiError('Your login has expired.', 401);
    }
    if (res.status === 404) {
      throw new ApiError(
        'Not found. The entry may have changed: reload the page.',
        404,
      );
    }
    if (!res.ok) {
      const text = await res.text();
      let reason = text.trim();
      try {
        reason = (JSON.parse(text) as { error?: string }).error ?? reason;
      } catch {
        // Not JSON: the text is the reason.
      }
      throw new ApiError(
        `Couldn't save (${res.status}${reason ? `: ${reason}` : ''}).`,
        res.status,
      );
    }
    return (res.status === 204 ? null : await res.json()) as T;
  }

  // Runs an action: apply shows it at once, undo takes it back if rtk-api
  // says no. key marks the action pending; a failure shows at `at`.
  async function run<T>(
    key: string,
    request: () => Promise<T>,
    {
      apply,
      undo,
      at = key,
    }: { apply?: () => void; undo?: () => void; at?: string } = {},
  ): Promise<T | undefined> {
    apply?.();
    setPending(p => ({ ...p, [key]: true }));
    setErrors(e => without(e, at));
    try {
      return await request();
    } catch (error) {
      undo?.();
      setErrors(e => ({
        ...e,
        [at]: {
          message: error instanceof Error ? error.message : String(error),
          expired: error instanceof ApiError && error.status === 401,
        },
      }));
      return undefined;
    } finally {
      setPending(p => without(p, key));
    }
  }

  const errorAt = (at: string) =>
    errors[at] && (
      <div className={styles.actionError} role="alert">
        {errors[at].message}
        {errors[at].expired && (
          <>
            {' '}
            <Link href="/login">Log in again</Link>
          </>
        )}
      </div>
    );

  const toggleDone = (at: string) => {
    const was = { done, doneAt };
    run('done', () => send('POST', '/done', { done: !was.done }), {
      at,
      apply: () => {
        setDone(!was.done);
        setDoneAt(was.done ? null : new Date().toISOString());
      },
      undo: () => {
        setDone(was.done);
        setDoneAt(was.doneAt);
      },
    });
  };

  const setSentenceHidden = (position: number, hide: boolean) =>
    run(
      `sentence:${position}`,
      () => send(hide ? 'POST' : 'DELETE', `/sentences/${position}/hide`),
      {
        apply: () =>
          setHiddenSentences(h =>
            hide ? { ...h, [position]: true } : without(h, String(position)),
          ),
        undo: () =>
          setHiddenSentences(h =>
            hide ? without(h, String(position)) : { ...h, [position]: true },
          ),
      },
    );
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
            <DictionaryItem
              bare
              entry={found}
              kanji={entry.kanji}
              targets={targets}
            />
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
  const doneButton = (at: string, accent: boolean) => (
    <button
      className={`${styles.button} ${done ? styles.active : accent ? styles.accent : ''}`}
      disabled={!!pending.done}
      onClick={() => toggleDone(at)}
      type="button"
    >
      {done ? 'Done' : 'Mark as done'}
    </button>
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
          <Link href="/reading">All entries</Link>
          {prevDate && (
            <Link href={`/reading/${prevDate}`}>
              Previous: {formatDay(prevDate, 'short')}
            </Link>
          )}
          {nextDate && (
            <Link href={`/reading/${nextDate}`}>
              Next: {formatDay(nextDate, 'short')}
            </Link>
          )}
          <Link href="/">All frames</Link>
        </div>
      </div>

      {status === 'hidden' && (
        <div className={styles.banner}>
          This entry is hidden. Visitors get a 404; only you can see it.
        </div>
      )}

      <div className={`${styles.card} ${styles.spread}`}>
        <div className={styles.row}>
          <span
            className={`${styles.chip} ${done ? styles.statusDone : ''}`}
            title={done && doneAt ? `Done ${formatTime(doneAt)}` : undefined}
          >
            {done ? 'Done' : 'Not done yet'}
          </span>
          {entry.backfilled && (
            <span
              className={`${styles.chip} ${styles.info}`}
              title="Generated after its date"
            >
              Generated later
            </span>
          )}
          <span className={`${styles.small} ${styles.muted}`}>
            Generated {formatTime(entry.generatedAt)} from{' '}
            {formatDay(entry.studyDate, 'short')}&apos;s reviews
          </span>
          {regenerateQueued && (
            <span
              className={`${styles.chip} ${styles.info}`}
              title="The generator rebuilds this entry on its next run"
            >
              Regeneration queued
            </span>
          )}
        </div>
        {loggedIn && (
          <div className={styles.row}>
            {doneButton('top', false)}
            <button
              className={`${styles.button} ${styles.quiet}`}
              disabled={regenerateQueued || !!pending.regenerate}
              onClick={() => {
                if (
                  window.confirm(
                    'Regenerate this entry? Sentence grades are lost. Comments, done and hidden sentences are kept.',
                  )
                ) {
                  run('regenerate', () => send('POST', '/regenerate'), {
                    at: 'top',
                  }).then(
                    // null is a 204; undefined, a failure.
                    reply => reply === null && setRegenerateQueued(true),
                  );
                }
              }}
              type="button"
            >
              {pending.regenerate ? 'Asking...' : 'Regenerate'}
            </button>
            <button
              className={`${styles.button} ${styles.quiet}`}
              disabled={!!pending.status}
              onClick={() => {
                const was = status;
                const next = was === 'hidden' ? 'published' : 'hidden';
                run('status', () => send('PATCH', '', { status: next }), {
                  at: 'top',
                  apply: () => setStatus(next),
                  undo: () => setStatus(was),
                });
              }}
              type="button"
            >
              {status === 'hidden' ? 'Unhide entry' : 'Hide entry'}
            </button>
          </div>
        )}
        {errorAt('top')}
      </div>

      <h2 className={styles.sectionTitle}>
        Yesterday&apos;s study
        <small>{formatDay(entry.studyDate)}</small>
      </h2>
      <div className={styles.stats}>
        {[
          [stats.reviews, 'reviews'],
          [Math.round(stats.minutes), 'minutes'],
          [
            stats.againRate === null ? 'n/a' : percent(stats.againRate),
            'answered Again',
          ],
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
          {stats.weakestLessons.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </div>
      {entry.summary && (
        <div className={styles.card} style={{ marginTop: 10 }}>
          <div className={styles.row}>
            <b>Where I am</b>
            {entry.summary.ai && (
              <span className={styles.aiLabel}>AI summary</span>
            )}
          </div>
          <p className={styles.summary}>{entry.summary.text}</p>
          <span className={`${styles.small} ${styles.muted}`}>
            Written{' '}
            {entry.summary.ai && entry.model ? `by ${entry.model} ` : ''}from
            the numbers above only.
          </span>
        </div>
      )}

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
                  {loggedIn && <a href={`/#${t.frame}`}>Write one</a>}
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
        {entry.sentences.map(s => {
          const prefix = `${s.id}:`;
          const key = `sentence:${s.position}`;
          if (hiddenSentences[s.position]) {
            return (
              <div
                className={`${styles.sentence} ${styles.hiddenSentence}`}
                key={s.id}
              >
                <span>
                  Hidden sentence: {plainText(s.tokens)}{' '}
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    disabled={!!pending[key]}
                    onClick={() => setSentenceHidden(s.position, false)}
                    type="button"
                  >
                    Unhide
                  </button>
                </span>
                {errorAt(key)}
              </div>
            );
          }
          const grade = grades[s.position];
          const gradeInfo = GRADES.find(g => g.grade === grade);
          return (
            <div className={styles.sentence} key={s.id}>
              <JapaneseText
                furigana={!!furigana.sentences}
                idPrefix={prefix}
                kanji={entry.kanji}
                onSelect={select}
                selected={selected?.key}
                targets={targets}
                tokens={s.tokens}
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
                        href={
                          s.sourceId === null
                            ? `https://tatoeba.org/en/sentences/search?from=jpn&query=${encodeURIComponent(plainText(s.tokens))}`
                            : `https://tatoeba.org/en/sentences/show/${s.sourceId}`
                        }
                        rel="noreferrer"
                        target="_blank"
                      >
                        Tatoeba{s.owner && ` · ${s.owner}`}
                      </a>
                    ) : (
                      <span className={styles.aiLabel}>AI-written</span>
                    )}
                  </span>
                </div>
                {loggedIn ? (
                  <div className={styles.row}>
                    {GRADES.map(g => (
                      <button
                        className={`${styles.button} ${grade === g.grade ? styles.active : styles.quiet}`}
                        disabled={!!pending[key]}
                        key={g.grade}
                        onClick={() =>
                          run(
                            key,
                            () =>
                              send('PUT', `/grades/${s.position}`, {
                                grade: g.grade,
                              }),
                            {
                              apply: () =>
                                setGrades(gs => ({
                                  ...gs,
                                  [s.position]: g.grade,
                                })),
                              undo: () =>
                                setGrades(gs =>
                                  grade
                                    ? { ...gs, [s.position]: grade }
                                    : without(gs, String(s.position)),
                                ),
                            },
                          )
                        }
                        type="button"
                      >
                        {g.label}
                      </button>
                    ))}
                    <button
                      className={`${styles.button} ${styles.quiet}`}
                      disabled={!!pending[key]}
                      onClick={() => setSentenceHidden(s.position, true)}
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
              {errorAt(key)}
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
              kanji={entry.kanji}
              onSelect={select}
              selected={selected?.key}
              targets={targets}
              tokens={entry.passage.tokens}
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
              {entry.passage.ai && (
                <span className={styles.aiLabel}>AI-written</span>
              )}
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
                const keyword = entry.kanji[k]?.keyword;
                return keyword ? `${k} (${keyword})` : k;
              })
              .join(', ')}
          </p>
          {revealed[w.id] && (
            <>
              <JapaneseText
                furigana={!!furigana.writing}
                idPrefix={`${w.id}:`}
                kanji={entry.kanji}
                onSelect={select}
                selected={selected?.key}
                targets={targets}
                tokens={w.answer}
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
        {entry.targets.length > 0 && (
          <span>
            <b className={styles.target_}>{entry.targets[0].kanji}</b> a target
            kanji for today
          </span>
        )}
        {LEGEND.map(({ status, label }) => {
          const sample = Object.entries(entry.kanji).find(
            ([, k]) => k.status === status,
          )?.[0];
          return (
            sample && (
              <span key={status}>
                <span className={STATUS_CLASS[status]}>{sample}</span> {label}
              </span>
            )
          );
        })}
      </div>
      <div className={styles.dictionary}>
        {entry.dictionary.map(d => (
          <DictionaryItem
            entry={d}
            kanji={entry.kanji}
            key={d.forms[0]}
            targets={targets}
          />
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
        {comments.map(c => {
          const key = `comment:${c.id}`;
          // Posted but not saved yet: rtk-api hasn't given it an id.
          const unsaved = c.id < 0;
          return (
            <div className={styles.comment} key={c.id}>
              <div className={`${styles.small} ${styles.muted}`}>
                Warren · {formatTime(c.createdAt)}
                {c.updatedAt && ' · edited'}
                {unsaved && ' · saving'}
              </div>
              {editing?.id === c.id ? (
                <>
                  <textarea
                    className={styles.textarea}
                    onChange={e =>
                      setEditing({ id: c.id, body: e.target.value })
                    }
                    value={editing.body}
                  />
                  <div className={styles.row}>
                    <button
                      className={styles.button}
                      disabled={!editing.body.trim()}
                      onClick={() => {
                        const body = editing.body.trim();
                        run(
                          key,
                          () =>
                            send<ApiComment>('PATCH', `/comments/${c.id}`, {
                              body,
                            }),
                          {
                            apply: () => {
                              setComments(cs =>
                                cs.map(x =>
                                  x.id === c.id
                                    ? {
                                        ...x,
                                        body,
                                        updatedAt: new Date().toISOString(),
                                      }
                                    : x,
                                ),
                              );
                              setEditing(null);
                            },
                            undo: () => {
                              setComments(cs =>
                                cs.map(x => (x.id === c.id ? c : x)),
                              );
                              setEditing({ id: c.id, body });
                            },
                          },
                        ).then(
                          saved =>
                            saved &&
                            setComments(cs =>
                              cs.map(x =>
                                x.id === c.id ? fromComment(saved) : x,
                              ),
                            ),
                        );
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
              {loggedIn && !unsaved && editing?.id !== c.id && (
                <div className={styles.row} style={{ marginTop: 6 }}>
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    disabled={!!pending[key]}
                    onClick={() => setEditing({ id: c.id, body: c.body })}
                    type="button"
                  >
                    Edit
                  </button>
                  <button
                    className={`${styles.button} ${styles.quiet}`}
                    disabled={!!pending[key]}
                    onClick={() =>
                      run(key, () => send('DELETE', `/comments/${c.id}`), {
                        apply: () =>
                          setComments(cs => cs.filter(x => x.id !== c.id)),
                        undo: () =>
                          setComments(cs => [...cs, c].sort(byCreated)),
                      })
                    }
                    type="button"
                  >
                    Delete
                  </button>
                </div>
              )}
              {errorAt(key)}
            </div>
          );
        })}
        {loggedIn && (
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
                const body = draft.trim();
                const id = -Date.now();
                run(
                  `comment:${id}`,
                  () => send<ApiComment>('POST', '/comments', { body }),
                  {
                    at: 'newComment',
                    apply: () => {
                      setComments(cs => [
                        ...cs,
                        {
                          id,
                          body,
                          createdAt: new Date().toISOString(),
                          updatedAt: null,
                        },
                      ]);
                      setDraft('');
                    },
                    undo: () => {
                      setComments(cs => cs.filter(x => x.id !== id));
                      setDraft(body);
                    },
                  },
                ).then(
                  saved =>
                    saved &&
                    setComments(cs =>
                      cs.map(x => (x.id === id ? fromComment(saved) : x)),
                    ),
                );
              }}
              type="button"
            >
              Post comment
            </button>
            {errorAt('newComment')}
          </div>
        )}
      </div>

      {loggedIn && (
        <div
          className={`${styles.card} ${styles.spread}`}
          style={{ marginTop: 24 }}
        >
          <b>{done ? 'Done for today.' : 'Finished the homework?'}</b>
          {doneButton('finish', true)}
          {errorAt('finish')}
        </div>
      )}
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
  value: number | null;
  color: string;
  target?: number;
}) {
  return (
    <>
      <span>{label}</span>
      <div className={styles.barTrack}>
        {value !== null && (
          <div
            className={styles.barFill}
            style={{ width: percent(value), background: color }}
          />
        )}
        {target !== undefined && (
          <div className={styles.barTarget} style={{ left: percent(target) }} />
        )}
      </div>
      <span>{value === null ? 'n/a' : percent(value)}</span>
    </>
  );
}
