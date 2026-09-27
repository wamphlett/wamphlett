'use client';
import { Fragment, memo, useEffect, useRef, useState } from 'react';
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
  onComponentClick?: (component: string) => void;
  onUpdate?: (frameNumber: number, patch: FramePatch) => void;
};

function Frame({ data, token, onComponentClick, onUpdate }: FrameProps) {
  const editable = !!token;
  const { apiUrl } = useRuntimeConfig();
  const commit = (
    field: EditableField,
    transformFunc?: (value: string) => string | string[],
  ) =>
    update(data.frame_number, field, apiUrl!, token!, onUpdate, transformFunc);

  return (
    <div className={styles.container}>
      <div className="flex flex-column justify-between items-center">
        <span className={styles.frameNumber}>#{data.frame_number}</span>
        <h2>{data.keyword}</h2>
      </div>

      {(editable || (data.primitives && data.primitives.length > 0)) && (
        <div className="flex flex-column justify-end items-center">
          {editable ? (
            <InputBox
              className={styles.right}
              initialValue={data.primitives?.join('... ')}
              onCommit={commit('primitives', split)}
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
          {(editable || (data.components && data.components.length > 0)) &&
            (editable ? (
              <InputBox
                initialValue={data.components?.join('... ')}
                onCommit={commit('components', split)}
                placeholder="components..."
                small
              />
            ) : (
              <span className={styles.components}>
                {data.components?.map((component, i) => (
                  <Fragment key={component + i}>
                    {i > 0 && '... '}
                    <span
                      className={styles.componentLink}
                      onClick={() => onComponentClick?.(component)}
                      role="button"
                      tabIndex={0}
                    >
                      {component}
                    </span>
                  </Fragment>
                ))}
              </span>
            ))}

          {editable ? (
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
          )}

          {(editable || data.comment) && editable ? (
            <InputBox
              initialValue={data.comment}
              onCommit={commit('comment')}
              placeholder="comments..."
              small
            />
          ) : (
            <span>{data.comment}</span>
          )}
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
          {data.jlpt && (
            <span className={styles.jlpt + ' ' + styles['level_' + data.jlpt]}>
              {data.jlpt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

type SaveStatus =
  | { state: 'idle' }
  | { state: 'saved'; at: number }
  | { state: 'error'; message: string };

// Shared edit/commit behaviour for InputBox and TextBox: local value that
// follows the persisted value, a commit on blur that is skipped when nothing
// changed, and a save status the field renders as feedback.
function useCommittedValue(
  initialValue: string,
  onCommit?: (value: string) => Promise<void>,
) {
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }
  const [status, setStatus] = useState<SaveStatus>({ state: 'idle' });

  const commit = async () => {
    if (!onCommit) {
      return;
    }
    if (value === initialValue) {
      // Back to the persisted value: nothing to save, and any earlier failure no longer applies.
      setStatus({ state: 'idle' });
      return;
    }
    try {
      await onCommit(value);
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
        onBlur={commit}
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
        onBlur={commit}
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
  transformFunc?: (value: string) => string | string[],
): (value: string) => Promise<void> {
  return async function (input: string): Promise<void> {
    const updatedValue = transformFunc ? transformFunc(input) : input;
    const payload = { [field]: updatedValue } as FramePatch;

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

function split(input: string): string[] {
  return input.split('...').map(s => s.trim());
}

export default memo(Frame);
