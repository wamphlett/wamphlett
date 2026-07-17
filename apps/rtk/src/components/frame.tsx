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

type FrameProps = {
  data: FrameData;
  token?: string;
  onComponentClick?: (component: string) => void;
};

function Frame({ data, token, onComponentClick }: FrameProps) {
  const editable = !!token;
  const { apiUrl } = useRuntimeConfig();

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
              onCommit={update(
                data.keyword,
                'primitives',
                apiUrl!,
                token,
                split,
              )}
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
                onCommit={update(
                  data.keyword,
                  'components',
                  apiUrl!,
                  token,
                  split,
                )}
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
              onCommit={update(data.keyword, 'story', apiUrl!, token)}
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
              onCommit={update(data.keyword, 'comment', apiUrl!, token)}
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

type InputBoxProps = {
  initialValue?: string;
  placeholder?: string;
  onCommit?: (value: string) => void;
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
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }

  return (
    <input
      className={`${styles.inputBox} ${className} ${small ? styles.small : ''}`}
      onBlur={() => {
        onCommit?.(value);
      }}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      type="text"
      value={value}
    />
  );
}

type TextBoxProps = {
  initialValue?: string;
  placeholder?: string;
  onCommit?: (value: string) => void;
  className?: string;
};

export function TextBox({
  initialValue = '',
  placeholder = 'story...',
  onCommit,
  className,
}: TextBoxProps) {
  const [value, setValue] = useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);
  const ref = useRef<HTMLTextAreaElement>(null);

  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setValue(initialValue);
  }

  // Auto-grow when content changes
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.style.height = 'auto';
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      className={`${styles.inputBox} ${styles.textBox} ${className}`}
      onBlur={() => onCommit?.(value)}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      ref={ref}
      rows={1}
      value={value}
    />
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

function update(
  keyword: string,
  updateMask: string,
  apiUrl: string,
  token: string,
  transformFunc?: (value: string) => string | string[],
): (value: string) => void {
  return async function (input: string): Promise<void> {
    let updatedValue: string | string[] = input;
    if (transformFunc) {
      updatedValue = transformFunc(input);
    }
    const payload = {
      [updateMask]: updatedValue,
    };

    try {
      const url = `${apiUrl}/frames/${encodeURIComponent(keyword)}`;

      const res = await fetch(url, {
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

      await res.json();
    } catch (err) {
      console.error(`Failed to update ${keyword}:`, err);
    }
  };
}

function split(input: string): string[] {
  return input.split('...').map(s => s.trim());
}

export default memo(Frame);
