// The site's shapes for a daily entry. They follow version 1 of the payload
// that rtk-anki writes (see ./payload), in camelCase, plus what rtk-api keeps
// on the site: status, done, grades and comments. Fetched by ./data.

export type ReasonCode =
  | 'again_yesterday'
  | 'leech'
  | 'low_stability'
  | 'lapses_14d'
  | 'reading_struggle';

export type Reason = { code: ReasonCode; value: number | null };

export type Target = {
  kanji: string;
  frame: number;
  keyword: string;
  story: string | null;
  comment: string | null;
  reasons: Reason[];
};

export type KanjiStatus = 'covered' | 'not_studied' | 'not_in_rtk';

export type KanjiInfo = {
  frame: number | null;
  keyword: string | null;
  status: KanjiStatus;
};

// Japanese text is a list of tokens; joining their surfaces gives the text.
// Parts split a token into kanji runs (with a reading) and kana or
// punctuation (reading null). A token with no reading is plain text.
export type TokenPart = { text: string; reading: string | null };

export type Token = {
  surface: string;
  lemma: string;
  reading: string | null;
  parts: TokenPart[];
};

export type Sentence = {
  id: string;
  position: number;
  tokens: Token[];
  translation: string;
  source: 'tatoeba' | 'ai';
  sourceId: number | null;
  owner: string | null;
  // Only ever true when logged in: visitors never get hidden sentences.
  hidden: boolean;
};

export type WritingTask = {
  id: string;
  prompt: string;
  answer: Token[];
  uses: string[];
};

export type DictionaryKanji = {
  kanji: string;
  // null when the reading belongs to the whole word (jukujikun).
  reading: string | null;
  note: string | null;
};

export type DictionaryEntry = {
  // The forms that appear in the day's text; the first is shown.
  forms: string[];
  lemma: string;
  reading: string;
  meanings: string[];
  wholeWordReading: boolean;
  kanji: DictionaryKanji[];
};

// Rates are fractions 0..1, null when there were no reviews of that kind.
export type Stats = {
  reviews: number;
  minutes: number;
  againRate: number | null;
  recallAgainRate: number | null;
  recognitionAgainRate: number | null;
  newKanji: number;
  weeklyRetention: {
    week: string;
    recall: number | null;
    recognition: number | null;
  }[];
  weakestLessons: { lesson: number; againRate: number }[];
};

export type Grade = 'read' | 'furigana' | 'stuck';

export type Comment = {
  id: number;
  body: string;
  createdAt: string;
  // null until edited.
  updatedAt: string | null;
};

export type EntryStatus = 'published' | 'hidden';

export type DailyEntry = {
  date: string;
  studyDate: string;
  generatedAt: string;
  // Generated after its date.
  backfilled: boolean;
  // The JLPT level it was pitched at; null for entries from before levels.
  level: string | null;
  // null when the AI parts were skipped.
  model: string | null;
  stats: Stats;
  summary: { text: string; ai: boolean } | null;
  targets: Target[];
  // Every kanji that appears anywhere in the entry.
  kanji: Record<string, KanjiInfo>;
  sentences: Sentence[];
  passage: { tokens: Token[]; translation: string; ai: boolean } | null;
  writing: WritingTask[];
  dictionary: DictionaryEntry[];
  status: EntryStatus;
  done: boolean;
  doneAt: string | null;
  regenerateRequested: boolean;
  // Keyed by sentence position.
  grades: Record<string, Grade>;
  comments: Comment[];
};

export type DailySummary = {
  date: string;
  reviews: number;
  targets: { kanji: string; keyword: string }[];
  backfilled: boolean;
  status: EntryStatus;
  done: boolean;
};
