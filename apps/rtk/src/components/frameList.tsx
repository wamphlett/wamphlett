'use client';

import {
  useCallback,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { flushSync } from 'react-dom';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
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

import Frame, {
  CompactHeader,
  type FramePatch,
  type SheetSort,
  sortFrames,
  type SortKey,
} from './frame';

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

type Density = 'comfortable' | 'compact';

// View preference lives in localStorage. Read through useSyncExternalStore so
// the server render (and hydration) uses the default and switches afterwards,
// and so other tabs pick up changes via the storage event.
const DENSITY_KEY = 'rtk:density';
const DENSITY_EVENT = 'rtk:density-change';

function subscribeDensity(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener(DENSITY_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(DENSITY_EVENT, onChange);
  };
}

function readDensity(): Density {
  return localStorage.getItem(DENSITY_KEY) === 'compact'
    ? 'compact'
    : 'comfortable';
}

const DENSITY_OPTIONS: { value: Density; label: string }[] = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

type StoryFilter = 'all' | 'has' | 'missing';

const STORY_FILTER_OPTIONS: { value: StoryFilter; label: string }[] = [
  { value: 'all', label: 'All stories' },
  { value: 'has', label: 'With story' },
  { value: 'missing', label: 'Without story' },
];

// Matches the .highlighted animation in frame.module.css (hold ~5s, fade 1s).
const HIGHLIGHT_MS = 6000;

export default function FrameList({
  frames: initialFrames,
  token,
}: FrameProps) {
  // Edits are merged in here so frames re-mounted by the virtualizer (e.g.
  // after searching) show the saved values rather than the initial payload.
  const [frames, setFrames] = useState(initialFrames);
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const density = useSyncExternalStore(
    subscribeDensity,
    readDensity,
    (): Density => 'comfortable',
  );

  const handleFrameUpdate = useCallback(
    (frameNumber: number, patch: FramePatch) => {
      setFrames(prev =>
        prev.map(frame =>
          frame.frame_number === frameNumber ? { ...frame, ...patch } : frame,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    const handle = setTimeout(() => setQuery(inputValue), 150);
    return () => clearTimeout(handle);
  }, [inputValue]);

  // Compact-only column sort. The order is captured as ids when a header is
  // clicked, so saving an edit doesn't make the row jump to its new position.
  const [sort, setSort] = useState<SheetSort & { order: string[] }>();

  const cycleSort = (key: SortKey) => {
    const next: SheetSort | undefined =
      sort?.key !== key
        ? { key, direction: 'asc' }
        : sort.direction === 'asc'
          ? { key, direction: 'desc' }
          : undefined;
    setSort(
      next && {
        ...next,
        order: sortFrames(frames, next).map(frame => frame.id),
      },
    );
  };

  const orderedFrames = useMemo(() => {
    if (density !== 'compact' || !sort) {
      return frames;
    }
    const byId = new Map(frames.map(frame => [frame.id, frame]));
    return sort.order.flatMap(id => byId.get(id) ?? []);
  }, [frames, sort, density]);

  // Like sort, the matching frames are captured when the filter is picked:
  // writing a story while filtered to "without" shouldn't make the row vanish
  // (and take focus with it) the moment the field saves.
  const [storyFilter, setStoryFilter] = useState<{
    value: Exclude<StoryFilter, 'all'>;
    ids: Set<string>;
  }>();

  const changeStoryFilter = (value: StoryFilter) => {
    if (value === 'all') {
      setStoryFilter(undefined);
      return;
    }
    const wantStory = value === 'has';
    setStoryFilter({
      value,
      ids: new Set(
        frames
          .filter(frame => !!frame.story?.trim() === wantStory)
          .map(frame => frame.id),
      ),
    });
  };

  const filteredFrames = useMemo(() => {
    const visible = storyFilter
      ? orderedFrames.filter(frame => storyFilter.ids.has(frame.id))
      : orderedFrames;
    const q = query.trim().toLowerCase();
    if (!q) {
      return visible;
    }

    return visible.filter(
      frame =>
        frame.kanji.includes(query.trim()) ||
        frame.keyword
          .toLowerCase()
          .split(/[\s-]+/)
          .some(word => word.startsWith(q)) ||
        frame.primitives?.some(primitive =>
          primitive
            .toLowerCase()
            .split(/[\s-]+/)
            .some(word => word.startsWith(q)),
        ) ||
        String(frame.frame_number) === q,
    );
  }, [orderedFrames, storyFilter, query]);

  const listRef = useRef<HTMLDivElement>(null);
  const listOffsetRef = useRef(0);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    listOffsetRef.current = listRef.current?.offsetTop ?? 0;
  });

  const getObstructionHeight = useCallback(() => {
    if (!searchBarRef.current) {
      return 0;
    }
    const stickyTop =
      parseFloat(getComputedStyle(searchBarRef.current).top) || 0;
    return stickyTop + searchBarRef.current.offsetHeight;
  }, []);

  // @tanstack/react-virtual's documented scrollMargin pattern: listOffsetRef
  // is measured synchronously in useLayoutEffect above, so reading it here
  // during render avoids an extra render pass rather than mirroring it into
  // state.
  /* eslint-disable react-hooks/refs */
  const virtualizer = useWindowVirtualizer({
    count: filteredFrames.length,
    estimateSize: () => (density === 'compact' ? 40 : 260),
    overscan: 6,
    scrollMargin: listOffsetRef.current,
    getItemKey: index => filteredFrames[index].id,
  });
  /* eslint-enable react-hooks/refs */

  // Component name → the frame it refers to: a keyword match wins,
  // otherwise the first frame that lists it as a primitive.
  const componentIndex = useMemo(() => {
    const index = new Map<string, FrameData>();
    frames.forEach(frame => {
      const key = frame.keyword.toLowerCase();
      if (!index.has(key)) {
        index.set(key, frame);
      }
    });
    frames.forEach(frame =>
      frame.primitives?.forEach(primitive => {
        const key = primitive.toLowerCase();
        if (!index.has(key)) {
          index.set(key, frame);
        }
      }),
    );
    return index;
  }, [frames]);

  const resolveComponent = useCallback(
    (component: string) => componentIndex.get(component.trim().toLowerCase()),
    [componentIndex],
  );

  // react-virtual only self-corrects its target for rows that were still
  // at an estimated (unmeasured) height while a scroll is "auto" — that
  // correction is explicitly skipped once behavior is "smooth", since
  // adjusting the destination mid-CSS-animation would look glitchy. So a
  // plain smooth scrollToIndex/scrollToOffset can land short by however
  // many rows between here and the target hadn't been measured yet.
  //
  // Instead, drive the animation ourselves: each frame, recompute the true
  // target via an instant (self-correcting) jump and ease window.scrollTo
  // toward it. As the animation gets physically closer to the target, more
  // of the intervening rows render and get measured for real, so the
  // computed target keeps converging on the accurate value — the same
  // self-correction "auto" mode gets, just spread continuously across a
  // smooth-looking motion instead of applied once.
  const scrollToFrame = useCallback(
    (index: number, duration: number) => {
      const startY = window.scrollY;
      const startTime = performance.now();
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const getTarget = () => {
        virtualizer.scrollToIndex(index, { align: 'start', behavior: 'auto' });
        const y = Math.max(window.scrollY - getObstructionHeight(), 0);
        window.scrollTo(0, startY);
        return y;
      };

      const step = () => {
        const t = Math.min((performance.now() - startTime) / duration, 1);
        const target = getTarget();
        window.scrollTo(0, startY + (target - startY) * easeOutCubic(t));

        if (t < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    },
    [virtualizer, getObstructionHeight],
  );

  // Clears search and filter so the frame is in the list, then scrolls it to
  // just below the sticky search bar.
  const showFrame = useCallback(
    (target: FrameData) => {
      flushSync(() => {
        setInputValue('');
        setQuery('');
        setStoryFilter(undefined);
      });

      // With search and filter cleared the list is orderedFrames, which may be sorted.
      scrollToFrame(orderedFrames.indexOf(target), 500);
    },
    [orderedFrames, scrollToFrame],
  );

  const handleComponentClick = useCallback(
    (component: string) => {
      const target = componentIndex.get(component.trim().toLowerCase());
      if (target) {
        showFrame(target);
      }
    },
    [componentIndex, showFrame],
  );

  // Deep links: #<frame number> (what the frame number links to) or #<kanji>.
  const [highlightedId, setHighlightedId] = useState<string>();

  const revealFromHash = useEffectEvent(() => {
    const key = decodeURIComponent(window.location.hash.slice(1));
    const target = key
      ? frames.find(
          frame => String(frame.frame_number) === key || frame.kanji === key,
        )
      : undefined;
    if (!target) {
      return;
    }
    showFrame(target);
    setHighlightedId(target.id);
  });

  useEffect(() => {
    // Initial link: wait a frame so the list has laid out (its offset below
    // the intro is measured) before computing where to scroll.
    const initial = requestAnimationFrame(() => revealFromHash());
    const onHashChange = () => revealFromHash();
    window.addEventListener('hashchange', onHashChange);
    return () => {
      cancelAnimationFrame(initial);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    if (!highlightedId) {
      return;
    }
    const timer = setTimeout(() => setHighlightedId(undefined), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [highlightedId]);

  // Frame (by id) to keep in view across a density switch, captured before
  // the switch. By id because the two densities can order rows differently.
  const densityAnchorRef = useRef<string | undefined>(undefined);

  const changeDensity = (next: Density) => {
    if (next === density) {
      return;
    }
    // Virtual item offsets are already in window scroll coordinates (they
    // include scrollMargin). Anchor on the first row that is mostly visible
    // below the sticky search bar, not a sliver peeking out from under it.
    const viewTop = window.scrollY + getObstructionHeight();
    const item = virtualizer
      .getVirtualItems()
      .find(virtualItem => (virtualItem.start + virtualItem.end) / 2 > viewTop);
    densityAnchorRef.current = item && filteredFrames[item.index].id;
    localStorage.setItem(DENSITY_KEY, next);
    window.dispatchEvent(new Event(DENSITY_EVENT));
  };

  // Row heights change completely between densities: drop the cached
  // measurements, then bring the frame that was at the top back to the top.
  useLayoutEffect(() => {
    virtualizer.measure();
    const anchor = densityAnchorRef.current;
    densityAnchorRef.current = undefined;
    const index = filteredFrames.findIndex(frame => frame.id === anchor);
    if (index !== -1 && window.scrollY > 0) {
      scrollToFrame(index, 150);
    }
  }, [density]);

  return (
    <div
      className={`${styles.container} ${density === 'compact' ? styles.wide : ''}`}
    >
      <div className={styles.searchBar} ref={searchBarRef}>
        <input
          className={styles.searchInput}
          onChange={e => setInputValue(e.target.value)}
          placeholder="Search by kanji, number, or keyword..."
          type="text"
          value={inputValue}
        />
        <select
          aria-label="Filter by story"
          className={styles.filterSelect}
          onChange={e => changeStoryFilter(e.target.value as StoryFilter)}
          value={storyFilter?.value ?? 'all'}
        >
          {STORY_FILTER_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div
          aria-label="Row density"
          className={styles.densityToggle}
          role="group"
        >
          {DENSITY_OPTIONS.map(option => (
            <button
              aria-pressed={density === option.value}
              className={styles.densityOption}
              key={option.value}
              onClick={() => changeDensity(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        {density === 'compact' && (
          <CompactHeader onSort={cycleSort} sort={sort} />
        )}
      </div>

      {filteredFrames.length > 0 ? (
        <div
          className={density === 'compact' ? styles.sheetList : undefined}
          ref={listRef}
          style={{
            position: 'relative',
            width: '100%',
            height: virtualizer.getTotalSize(),
          }}
        >
          {virtualizer.getVirtualItems().map(virtualRow => (
            <div
              data-index={virtualRow.index}
              key={virtualRow.key}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                overflow: 'hidden',
                transform: `translateY(${virtualRow.start - virtualizer.options.scrollMargin}px)`,
              }}
            >
              <Frame
                compact={density === 'compact'}
                data={filteredFrames[virtualRow.index]}
                highlighted={virtualRow.key === highlightedId}
                onComponentClick={handleComponentClick}
                onUpdate={handleFrameUpdate}
                resolveComponent={resolveComponent}
                token={token}
              />
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>
          {query
            ? `No kanji match "${query}".`
            : 'No kanji match these filters.'}
        </p>
      )}
    </div>
  );
}
