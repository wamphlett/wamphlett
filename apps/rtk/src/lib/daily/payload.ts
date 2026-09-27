// rtk-api's GET /reading/{date}: version 1 of the daily payload that
// `rtk-anki daily` writes, plus what the site keeps (status, done, grades,
// comments), and its mapping to the site's types. Nullable fields are always
// present. The payload is documented in rtk-anki's docs/daily-reading.md.
import type {
  Comment,
  DailyEntry,
  DailySummary,
  DictionaryEntry,
  EntryStatus,
  Grade,
  KanjiInfo,
  Reason,
  Token,
} from './types';

type Source =
  // Tatoeba sentences can have no owner (a deleted account).
  | { source: 'tatoeba'; source_id: number; owner: string | null }
  | { source: 'ai'; source_id: null; owner: null };

export type DailyPayload = {
  // Checked by fromPayload: only version 1 is read.
  version: number;
  date: string;
  study_date: string;
  generated_at: string;
  backfilled: boolean;
  generator: { version: string; model: string | null };
  stats: {
    reviews: number;
    minutes: number;
    again_rate: number | null;
    recall_again_rate: number | null;
    recognition_again_rate: number | null;
    new_kanji: number;
    weekly_retention: {
      week: string;
      recall: number | null;
      recognition: number | null;
    }[];
    weakest_lessons: { lesson: number; again_rate: number; reviews: number }[];
  };
  summary: { text: string; ai: boolean } | null;
  targets: {
    kanji: string;
    frame: number;
    keyword: string;
    story: string | null;
    comment: string | null;
    score: number;
    reasons: Reason[];
  }[];
  kanji: Record<string, KanjiInfo>;
  sentences: ({
    position: number;
    translation: string;
    tokens: Token[];
    // Only sent to a logged-in request.
    hidden?: boolean;
  } & Source)[];
  passage: { ai: boolean; translation: string; tokens: Token[] } | null;
  writing: ({
    position: number;
    prompt: string;
    uses: string[];
    answer: Token[];
  } & Source)[];
  dictionary: (Omit<DictionaryEntry, 'wholeWordReading'> & {
    whole_word_reading: boolean;
  })[];
};

export type ApiComment = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string | null;
};

export type DailyResponse = DailyPayload & {
  status: EntryStatus;
  done: boolean;
  done_at: string | null;
  regenerate_requested: boolean;
  // Keyed by sentence position.
  grades: Record<string, Grade>;
  comments: ApiComment[];
};

// One item of GET /reading.
export type DailyListItem = {
  date: string;
  backfilled: boolean;
  status: EntryStatus;
  done: boolean;
  reviews: number;
  targets: { kanji: string; frame: number; keyword: string }[];
};

export type DailyList = {
  entries: DailyListItem[];
  next_before: string | null;
};

export const fromComment = (c: ApiComment): Comment => ({
  id: c.id,
  body: c.body,
  createdAt: c.created_at,
  updatedAt: c.updated_at,
});

export const fromListItem = (item: DailyListItem): DailySummary => ({
  date: item.date,
  reviews: item.reviews,
  targets: item.targets.map(t => ({ kanji: t.kanji, keyword: t.keyword })),
  backfilled: item.backfilled,
  status: item.status,
  done: item.done,
});

export function fromPayload(payload: DailyResponse): DailyEntry {
  if (payload.version !== 1) {
    throw new Error(
      `Unsupported daily payload version ${JSON.stringify(payload.version)}; this site reads version 1.`,
    );
  }
  const { stats } = payload;
  return {
    date: payload.date,
    studyDate: payload.study_date,
    generatedAt: payload.generated_at,
    backfilled: payload.backfilled,
    model: payload.generator.model,
    stats: {
      reviews: stats.reviews,
      minutes: stats.minutes,
      againRate: stats.again_rate,
      recallAgainRate: stats.recall_again_rate,
      recognitionAgainRate: stats.recognition_again_rate,
      newKanji: stats.new_kanji,
      weeklyRetention: stats.weekly_retention,
      weakestLessons: stats.weakest_lessons.map(l => ({
        lesson: l.lesson,
        againRate: l.again_rate,
      })),
    },
    summary: payload.summary,
    targets: payload.targets.map(t => ({
      kanji: t.kanji,
      frame: t.frame,
      keyword: t.keyword,
      story: t.story,
      comment: t.comment,
      reasons: t.reasons,
    })),
    kanji: payload.kanji,
    sentences: payload.sentences.map(s => ({
      id: `s${s.position}`,
      position: s.position,
      tokens: s.tokens,
      translation: s.translation,
      source: s.source,
      sourceId: s.source_id,
      owner: s.owner,
      hidden: s.hidden ?? false,
    })),
    passage: payload.passage,
    writing: payload.writing.map(w => ({
      id: `w${w.position}`,
      prompt: w.prompt,
      answer: w.answer,
      uses: w.uses,
    })),
    dictionary: payload.dictionary.map(d => ({
      forms: d.forms,
      lemma: d.lemma,
      reading: d.reading,
      meanings: d.meanings,
      wholeWordReading: d.whole_word_reading,
      kanji: d.kanji,
    })),
    status: payload.status,
    done: payload.done,
    doneAt: payload.done_at,
    regenerateRequested: payload.regenerate_requested,
    grades: payload.grades,
    comments: payload.comments.map(fromComment),
  };
}
