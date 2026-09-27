'use client';
import {
  Fragment,
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useRuntimeConfig } from '@/lib/config/useRuntimeConfig';
import styles from './frame.module.css';

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

type EditableField = 'primitives' | 'components' | 'story' | 'comment';

export type FramePatch = Partial<Pick<FrameData, EditableField>>;

type FrameProps = {
  data: FrameData;
  token?: string;
  // Single dense row instead of the full card.
  compact?: boolean;
  onComponentClick?: (component: string) => void;
  // Finds the frame a component refers to, for the hover preview.
  resolveComponent?: (component: string) => FrameData | undefined;
  onUpdate?: (frameNumber: number, patch: FramePatch) => void;
  // Briefly outline the frame, e.g. after arriving from a #<frame> link.
  highlighted?: boolean;
};

function Frame({
  data,
  token,
  compact = false,
  onComponentClick,
  resolveComponent,
  onUpdate,
  highlighted = false,
}: FrameProps) {
  const editable = !!token;
  // Compact rows clamp the story to two lines; clicking it shows the rest.
  const [storyExpanded, setStoryExpanded] = useState(false);
  const { apiUrl } = useRuntimeConfig();
  const commit = (field: EditableField) =>
    update(data.frame_number, field, apiUrl!, token!, onUpdate);

  const components =
    (editable || (data.components && data.components.length > 0)) &&
    (editable ? (
      <PillInput
        className={styles.small}
        initialValue={data.components}
        onCommit={commit('components')}
        placeholder="components..."
      />
    ) : (
      <span className={styles.components}>
        {data.components?.map((component, i) => (
          <Fragment key={component + i}>
            {i > 0 && '... '}
            <ComponentLink
              component={component}
              onClick={() => onComponentClick?.(component)}
              target={resolveComponent?.(component)}
            />
          </Fragment>
        ))}
      </span>
    ));

  const story = editable ? (
    <TextBox
      initialValue={data.story}
      onCommit={commit('story')}
      placeholder="story..."
    />
  ) : data.story ? (
    <p
      dangerouslySetInnerHTML={{
        __html: formatStory(data.story, data.keyword, data.components),
      }}
    />
  ) : (
    <p>
      <i>No story provided yet.</i>
    </p>
  );

  const comment =
    (editable || data.comment) && editable ? (
      <InputBox
        initialValue={data.comment}
        onCommit={commit('comment')}
        placeholder="comments..."
        small
      />
    ) : (
      <span>{data.comment}</span>
    );

  const jlpt = data.jlpt && (
    <span className={styles.jlpt + ' ' + styles['level_' + data.jlpt]}>
      {data.jlpt}
    </span>
  );

  if (compact) {
    const readings = [data.on_reading, data.kun_reading]
      .map(reading => reading?.join(', '))
      .filter(Boolean)
      .join(' · ');
    // Line clamping clips editors' pills, save dot and error, so only clamp text.
    const clamp = editable ? '' : styles.clamp;
    return (
      <div
        className={`${styles.container} ${styles.sheetRow} ${editable ? styles.sheetEditing : ''} ${highlighted ? styles.highlighted : ''}`}
      >
        <a
          className={`${styles.frameNumber} ${styles.frameLink}`}
          href={`#${data.frame_number}`}
        >
          {data.frame_number}
        </a>
        <span className={styles.kanji}>{data.kanji}</span>
        <h2 className={styles.clamp}>{data.keyword}</h2>
        <div className={`${styles.sheetOptional} ${clamp}`}>
          {editable ? (
            <PillInput
              className={styles.small}
              initialValue={data.primitives}
              onCommit={commit('primitives')}
              placeholder="primitives..."
            />
          ) : (
            <span className={styles.primitives}>
              {data.primitives?.join('... ')}
            </span>
          )}
        </div>
        <div className={`${styles.sheetOptional} ${clamp}`}>{components}</div>
        {editable ? (
          <div className={styles.sheetStory}>{story}</div>
        ) : (
          <div
            className={`${styles.sheetStory} ${storyExpanded ? '' : styles.clamp}`}
            onClick={() => setStoryExpanded(expanded => !expanded)}
          >
            {story}
          </div>
        )}
        <span className={`${styles.sheetOptional} ${styles.sheetMuted}`}>
          {readings}
        </span>
        <div
          className={`${styles.sheetOptional} ${styles.sheetMuted} ${clamp}`}
        >
          {comment}
        </div>
        <span className={`${styles.sheetOptional} ${styles.sheetMuted}`}>
          {data.chapter}
        </span>
        <span className={`${styles.sheetOptional} ${styles.sheetMuted}`}>
          {data.stroke_count}
        </span>
        <span>{jlpt}</span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.container} ${highlighted ? styles.highlighted : ''}`}
    >
      <div className="flex flex-column justify-between items-center">
        <a
          className={`${styles.frameNumber} ${styles.frameLink}`}
          href={`#${data.frame_number}`}
        >
          #{data.frame_number}
        </a>
        <h2>{data.keyword}</h2>
      </div>

      {(editable || (data.primitives && data.primitives.length > 0)) && (
        <div className="flex flex-column justify-end items-center">
          {editable ? (
            <PillInput
              className={styles.right}
              initialValue={data.primitives}
              onCommit={commit('primitives')}
              placeholder="primitives..."
            />
          ) : (
            <span className={styles.primitives}>
              <b>primitives</b>: {data.primitives?.join('... ')}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-column content-center">
        <span className={styles.kanji}>{data.kanji}</span>
        <div className={styles.story}>
          {components}
          {story}
          {comment}
        </div>
      </div>

      <div
        className={
          'flex flex-column justify-between items-center ' + styles.details
        }
      >
        <div className="flex flex-column justify-start items-center">
          <span className={styles.stokes}>[{data.stroke_count}]</span>
          <span className={styles.reading}>
            <b>On</b>: {data.on_reading?.join(', ')}
          </span>
          <span className={styles.reading}>
            <b>Kun</b>: {data.kun_reading?.join(', ')}
          </span>
        </div>
        <div className="flex flex-column justify-end items-center">
          <span className={styles.chapter}>chapter: {data.chapter}</span>
          {jlpt}
        </div>
      </div>
    </div>
  );
}

export type SortKey =
  | 'number'
  | 'keyword'
  | 'primitives'
  | 'components'
  | 'readings'
  | 'notes'
  | 'chapter'
  | 'strokes'
  | 'jlpt';

export type SheetSort = { key: SortKey; direction: 'asc' | 'desc' };

// Easiest level first, so ascending reads N5 → N1.
const JLPT_RANK: Record<string, number> = { N5: 0, N4: 1, N3: 2, N2: 3, N1: 4 };

// What a frame sorts by in a column; undefined is an empty cell.
function sortValue(
  frame: FrameData,
  key: SortKey,
): string | number | undefined {
  switch (key) {
    case 'number':
      return frame.frame_number;
    case 'keyword':
      return frame.keyword;
    case 'primitives':
      return frame.primitives?.filter(Boolean).join(' ') || undefined;
    case 'components':
      return frame.components?.filter(Boolean).join(' ') || undefined;
    case 'readings':
      return (
        [...(frame.on_reading ?? []), ...(frame.kun_reading ?? [])].join(' ') ||
        undefined
      );
    case 'notes':
      return frame.comment || undefined;
    case 'chapter':
      return frame.chapter;
    case 'strokes':
      return frame.stroke_count;
    case 'jlpt':
      return frame.jlpt ? JLPT_RANK[frame.jlpt] : undefined;
  }
}

// Empty cells go last in either direction; ties keep frame order.
export function sortFrames<T extends FrameData>(
  frames: T[],
  sort: SheetSort,
): T[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  const sign = sort.direction === 'asc' ? 1 : -1;
  return frames
    .map(frame => ({ frame, value: sortValue(frame, sort.key) }))
    .sort((a, b) => {
      if (a.value === undefined || b.value === undefined) {
        if (a.value !== b.value) {
          return a.value === undefined ? 1 : -1;
        }
        return a.frame.frame_number - b.frame.frame_number;
      }
      const order =
        typeof a.value === 'number' && typeof b.value === 'number'
          ? a.value - b.value
          : collator.compare(String(a.value), String(b.value));
      return order * sign || a.frame.frame_number - b.frame.frame_number;
    })
    .map(entry => entry.frame);
}

// Column labels for the compact sheet; same grid and order as the rows above.
const SHEET_COLUMNS: {
  label: string;
  optional?: boolean;
  sortKey?: SortKey;
}[] = [
  { label: '#', sortKey: 'number' },
  { label: '' },
  { label: 'keyword', sortKey: 'keyword' },
  { label: 'primitives', optional: true, sortKey: 'primitives' },
  { label: 'components', optional: true, sortKey: 'components' },
  { label: 'story' },
  { label: 'readings', optional: true, sortKey: 'readings' },
  { label: 'notes', optional: true, sortKey: 'notes' },
  { label: 'ch', optional: true, sortKey: 'chapter' },
  { label: 'str', optional: true, sortKey: 'strokes' },
  { label: 'jlpt', sortKey: 'jlpt' },
];

type CompactHeaderProps = {
  sort?: SheetSort;
  onSort: (key: SortKey) => void;
};

export function CompactHeader({ sort, onSort }: CompactHeaderProps) {
  return (
    <div className={`${styles.sheetRow} ${styles.sheetHeader}`}>
      {SHEET_COLUMNS.map((column, i) => {
        const className = column.optional ? styles.sheetOptional : '';
        const { sortKey } = column;
        if (!sortKey) {
          return (
            <span className={className} key={i}>
              {column.label}
            </span>
          );
        }
        const direction = sort?.key === sortKey ? sort.direction : undefined;
        return (
          <button
            aria-label={
              direction
                ? `${column.label}, sorted ${direction === 'asc' ? 'ascending' : 'descending'}`
                : `Sort by ${column.label}`
            }
            className={`${className} ${styles.sortButton} ${direction ? styles.sorted : ''}`}
            key={i}
            onClick={() => onSort(sortKey)}
            type="button"
          >
            {column.label}
            {direction && (
              <span aria-hidden>{direction === 'asc' ? ' ▲' : ' ▼'}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

const PREVIEW_DELAY_MS = 200;
const PREVIEW_GAP_PX = 6;
const VIEWPORT_MARGIN_PX = 8;

type ComponentLinkProps = {
  component: string;
  target?: FrameData;
  onClick: () => void;
};

// Component name that jumps to its frame on click and, after a short hover,
// shows that frame in a floating read-only card.
function ComponentLink({ component, target, onClick }: ComponentLinkProps) {
  const [open, setOpen] = useState(false);
  const linkRef = useRef<HTMLSpanElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  // Place below the link, or above it when there isn't room; keep it on screen horizontally.
  useLayoutEffect(() => {
    if (!open || !linkRef.current || !previewRef.current) {
      return;
    }
    const link = linkRef.current.getBoundingClientRect();
    const preview = previewRef.current;
    const below = link.bottom + PREVIEW_GAP_PX;
    const top =
      below + preview.offsetHeight <= window.innerHeight - VIEWPORT_MARGIN_PX
        ? below
        : Math.max(
            VIEWPORT_MARGIN_PX,
            link.top - PREVIEW_GAP_PX - preview.offsetHeight,
          );
    const left = Math.max(
      VIEWPORT_MARGIN_PX,
      Math.min(
        link.left,
        window.innerWidth - preview.offsetWidth - VIEWPORT_MARGIN_PX,
      ),
    );
    preview.style.top = `${top}px`;
    preview.style.left = `${left}px`;
  }, [open]);

  // The preview is fixed-position, so it would drift away from the link on scroll; close it instead.
  useEffect(() => {
    if (!open) {
      return;
    }
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      <span
        className={styles.componentLink}
        onClick={() => {
          hide();
          onClick();
        }}
        onMouseEnter={
          target &&
          (() => {
            timer.current = window.setTimeout(
              () => setOpen(true),
              PREVIEW_DELAY_MS,
            );
          })
        }
        onMouseLeave={hide}
        ref={linkRef}
        role="button"
        tabIndex={0}
      >
        {component}
      </span>
      {/* Portaled: list rows clip their overflow. */}
      {open &&
        target &&
        createPortal(
          <div className={styles.preview} ref={previewRef} role="tooltip">
            <Frame data={target} />
          </div>,
          document.body,
        )}
    </>
  );
}

type SaveStatus =
  | { state: 'idle' }
  | { state: 'saved'; at: number }
  | { state: 'error'; message: string };

// Shared edit/commit behaviour for the edit fields: local value that follows
// the persisted value, a commit that is skipped when nothing changed, and a
// save status the field renders as feedback.
function useCommittedValue<T extends string | string[]>(
  initialValue: T,
  onCommit?: (value: T) => Promise<void>,
) {
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }
  const [status, setStatus] = useState<SaveStatus>({ state: 'idle' });

  // `next` lets callers commit a value they are setting in the same event,
  // before the state update has landed.
  const commit = async (next: T = value) => {
    if (!onCommit) {
      return;
    }
    const unchanged =
      Array.isArray(next) && Array.isArray(initialValue)
        ? next.length === initialValue.length &&
          next.every((item, i) => item === initialValue[i])
        : next === initialValue;
    if (unchanged) {
      // Back to the persisted value: nothing to save, and any earlier failure no longer applies.
      setStatus({ state: 'idle' });
      return;
    }
    try {
      await onCommit(next);
      setStatus({ state: 'saved', at: Date.now() });
    } catch (err) {
      setStatus({
        state: 'error',
        message: err instanceof Error ? err.message : String(err),
      });
    }
  };

  const clearSaved = () =>
    setStatus(s => (s.state === 'saved' ? { state: 'idle' } : s));

  const statusClass = status.state === 'error' ? styles.saveFailed : '';

  // Keyed by save time so back-to-back saves restart the dot's fade.
  const feedback =
    status.state === 'error' ? (
      <div className={styles.saveError} role="alert">
        Couldn&apos;t save: {status.message}
      </div>
    ) : status.state === 'saved' ? (
      <span
        aria-label="Saved"
        className={styles.savedDot}
        key={status.at}
        onAnimationEnd={clearSaved}
      />
    ) : null;

  return { value, setValue, commit, statusClass, feedback };
}

type InputBoxProps = {
  initialValue?: string;
  placeholder?: string;
  onCommit?: (value: string) => Promise<void>;
  className?: string;
  small?: boolean;
};

export function InputBox({
  initialValue = '',
  placeholder = 'primitives...',
  onCommit,
  className,
  small = false,
}: InputBoxProps) {
  const { value, setValue, commit, statusClass, feedback } = useCommittedValue(
    initialValue,
    onCommit,
  );

  return (
    <div className={styles.field}>
      <input
        className={`${styles.inputBox} ${className} ${small ? styles.small : ''} ${statusClass}`}
        onBlur={() => commit()}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {feedback}
    </div>
  );
}

type TextBoxProps = {
  initialValue?: string;
  placeholder?: string;
  onCommit?: (value: string) => Promise<void>;
  className?: string;
};

export function TextBox({
  initialValue = '',
  placeholder = 'story...',
  onCommit,
  className,
}: TextBoxProps) {
  const { value, setValue, commit, statusClass, feedback } = useCommittedValue(
    initialValue,
    onCommit,
  );
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow when content changes
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <div className={styles.field}>
      <textarea
        className={`${styles.inputBox} ${styles.textBox} ${className} ${statusClass}`}
        onBlur={() => commit()}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        ref={ref}
        rows={1}
        value={value}
      />
      {feedback}
    </div>
  );
}

// Stable default so a frame without a list doesn't hand the hook a fresh
// array (and reset its state) on every render.
const NO_ITEMS: string[] = [];

type PillInputProps = {
  initialValue?: string[];
  placeholder?: string;
  onCommit?: (value: string[]) => Promise<void>;
  className?: string;
};

// List editor: each entry is a pill; Tab/Enter turns the typed text into a
// pill, Backspace on an empty draft removes the last one. Like the other
// fields, the list is saved once when focus leaves the control.
export function PillInput({
  initialValue = NO_ITEMS,
  placeholder,
  onCommit,
  className = '',
}: PillInputProps) {
  const { value, setValue, commit, statusClass, feedback } = useCommittedValue(
    initialValue,
    onCommit,
  );
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // Older saves could store empty entries; never show or re-save them.
  const items = value.filter(item => item !== '');

  return (
    <div className={styles.field}>
      <div
        className={`${styles.inputBox} ${styles.pillBox} ${className} ${statusClass}`}
        onBlur={e => {
          if (e.currentTarget.contains(e.relatedTarget)) {
            return;
          }
          const pill = draft.trim();
          const next = pill ? [...items, pill] : items;
          setDraft('');
          setValue(next);
          commit(next);
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {items.map((item, i) => (
          <span className={styles.pill} key={`${item}-${i}`}>
            {item}
            {/* onMouseDown keeps focus in the text input so removing a pill doesn't count as leaving the field. */}
            <button
              aria-label={`Remove ${item}`}
              className={styles.pillRemove}
              onClick={e => {
                e.stopPropagation();
                setValue(items.filter((_, j) => j !== i));
                inputRef.current?.focus();
              }}
              onMouseDown={e => e.preventDefault()}
              type="button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          className={styles.pillInput}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            const pill = draft.trim();
            if (
              ((e.key === 'Tab' && !e.shiftKey) || e.key === 'Enter') &&
              pill
            ) {
              e.preventDefault();
              setValue([...items, pill]);
              setDraft('');
            } else if (
              e.key === 'Backspace' &&
              draft === '' &&
              items.length > 0
            ) {
              setValue(items.slice(0, -1));
            }
          }}
          placeholder={items.length ? undefined : placeholder}
          ref={inputRef}
          type="text"
          value={draft}
        />
      </div>
      {feedback}
    </div>
  );
}

function formatStory(
  story: string,
  keyword: string,
  components: string[],
): string {
  if (!story || !keyword) {
    return story;
  }

  // Escape regex special characters
  const escape = (str: string): string =>
    str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Matches: keyword | keywords | keyword's (case-insensitive)
  const keywordRegex = new RegExp(`\\b(${escape(keyword)})(s|'s)?\\b`, 'gi');

  // Wrap keyword first
  let result: string = story.replace(keywordRegex, (match: string): string => {
    return `<b>${match}</b>`;
  });

  // Wrap components
  for (const component of components) {
    if (!component) {
      continue;
    }

    const componentRegex = new RegExp(
      `\\b(${escape(component)})(s|'s)?\\b`,
      'gi',
    );

    result = result.replace(componentRegex, (match: string): string => {
      // Avoid double-wrapping
      if (/<\/?(b|i)>/i.test(match)) {
        return match;
      }
      return `<i>${match}</i>`;
    });
  }

  return result;
}

// Returns a commit handler that persists one field. Rejects on failure so the
// field can surface the error; on success the saved value is pushed up via
// onUpdate so the in-memory frame list (and anything re-mounting from it,
// e.g. after a search) reflects the edit.
function update(
  frameNumber: number,
  field: EditableField,
  apiUrl: string,
  token: string,
  onUpdate?: (frameNumber: number, patch: FramePatch) => void,
): (value: string | string[]) => Promise<void> {
  return async function (value: string | string[]): Promise<void> {
    const payload = { [field]: value } as FramePatch;

    const res = await fetch(`${apiUrl}/frames/${frameNumber}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || `Request failed (${res.status})`);
    }

    onUpdate?.(frameNumber, payload);
  };
}

export default memo(Frame);
