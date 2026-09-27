// Shapes follow the payload in rtk-anki's docs/daily-reading.md. The page is a
// mock for now: everything comes from ./mock, nothing from rtk-api.

export type ReasonCode =
  | 'again_yesterday'
  | 'leech'
  | 'low_stability'
  | 'lapses_14d'
  | 'reading_struggle';

export type Reason = { code: ReasonCode; value?: number };

export type Target = {
  kanji: string;
  frame: number;
  keyword: string;
  story?: string;
  comment?: string;
  reasons: Reason[];
};

// Japanese text uses a small markup: {word} groups a word, and inside it a
// kanji run is followed by its reading in brackets, e.g. {占[うらな]い師[し]}.
// Text outside braces is plain.
export type Sentence = {
  id: string;
  text: string;
  translation: string;
  source: 'tatoeba' | 'ai';
  owner?: string;
};

export type WritingTask = {
  id: string;
  prompt: string;
  answer: string;
  uses: string[];
};

export type KanjiStatus = 'covered' | 'not_studied' | 'not_in_rtk';

export type DictionaryKanji = {
  kanji: string;
  // null when the reading belongs to the whole word (jukujikun).
  reading: string | null;
  note?: string;
};

export type DictionaryEntry = {
  // The forms that appear in the day's text; the first is shown.
  forms: string[];
  reading: string;
  lemma?: string;
  meanings: string[];
  wholeWordReading?: boolean;
  kanji: DictionaryKanji[];
};

export type Stats = {
  reviews: number;
  minutes: number;
  againRate: number;
  recallAgainRate: number;
  recognitionAgainRate: number;
  newKanji: number;
  weeklyRetention: { week: string; recall: number; recognition: number }[];
  weakestLessons: { lesson: number; againRate: number }[];
};

export type Grade = 'read' | 'furigana' | 'stuck';

export type Comment = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
};

export type DailyEntry = {
  date: string;
  studyDate: string;
  generatedAt: string;
  model: string;
  stats: Stats;
  summary: string;
  targets: Target[];
  sentences: Sentence[];
  passage: { text: string; translation: string } | null;
  writing: WritingTask[];
  dictionary: DictionaryEntry[];
  done: boolean;
  grades: Record<string, Grade>;
  comments: Comment[];
};

export type DailySummary = {
  date: string;
  reviews: number;
  targets: { kanji: string; keyword: string }[];
  done: boolean;
};
