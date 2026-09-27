// Mock data for the daily reading page. Keywords, frame numbers and stories
// are real (copied from rtk-api); the stats, sentences' sources, summary and
// grades are made up. See rtk-anki's docs/daily-reading.md for the design.
import { KANJI } from './kanji';
import { parseJapanese } from './text';
import type {
  DailyEntry,
  DailySummary,
  DictionaryEntry,
  KanjiInfo,
  ReasonCode,
  Sentence,
  Target,
} from './types';

export const MOCK_TODAY = '2026-09-27';

// The hand-written shape: Japanese as markup (see ./text), and fields that
// would be null left out. toEntry turns it into the site's types.
type MockEntry = Pick<
  DailyEntry,
  'generatedAt' | 'model' | 'stats' | 'done' | 'grades' | 'comments'
> & {
  summary: string;
  targets: (Pick<Target, 'kanji' | 'frame' | 'keyword'> & {
    story?: string;
    comment?: string;
    reasons: { code: ReasonCode; value?: number }[];
  })[];
  sentences: {
    id: string;
    text: string;
    translation: string;
    source: Sentence['source'];
    owner?: string;
  }[];
  passage: { text: string; translation: string };
  writing: { id: string; prompt: string; answer: string; uses: string[] }[];
  dictionary: (Pick<DictionaryEntry, 'forms' | 'reading' | 'meanings'> & {
    lemma?: string;
    wholeWordReading?: boolean;
    kanji: { kanji: string; reading: string | null; note?: string }[];
  })[];
};

const mock: MockEntry = {
  generatedAt: '2026-09-27T04:31:12Z',
  model: 'mock-model',
  stats: {
    reviews: 186,
    minutes: 41,
    againRate: 0.21,
    recallAgainRate: 0.25,
    recognitionAgainRate: 0.17,
    newKanji: 0,
    weeklyRetention: [
      { week: '2026-08-31', recall: 0.71, recognition: 0.79 },
      { week: '2026-09-07', recall: 0.74, recognition: 0.81 },
      { week: '2026-09-14', recall: 0.69, recognition: 0.78 },
      { week: '2026-09-21', recall: 0.73, recognition: 0.8 },
    ],
    weakestLessons: [
      { lesson: 34, againRate: 0.29 },
      { lesson: 41, againRate: 0.27 },
      { lesson: 12, againRate: 0.26 },
    ],
  },
  summary:
    'A steady 41 minutes: 186 reviews, 21% answered Again. Recall is still the harder direction, 25% Again against 17% for Recognition, and Recall retention has sat between 69% and 74% for four weeks, well short of the 90% target. Lesson 34 is costing the most at 29%. All four of today\u2019s kanji are leeches, and two of them, 府 and 喉, have no story on the site yet. Writing those two stories is probably the cheapest win available.',
  targets: [
    {
      kanji: '占',
      frame: 49,
      keyword: 'fortune-telling',
      story:
        'The person holding the the divining rode and speaking crap from their mouth.',
      reasons: [
        { code: 'again_yesterday', value: 3 },
        { code: 'lapses_14d', value: 4 },
        { code: 'leech' },
      ],
    },
    {
      kanji: '卓',
      frame: 52,
      keyword: 'eminent',
      story:
        'The person with th magic wand making sunflowers magically appear.',
      comment: 'Eminent is a well know person, think David Blaine',
      reasons: [{ code: 'again_yesterday', value: 1 }, { code: 'leech' }],
    },
    {
      kanji: '府',
      frame: 1077,
      keyword: 'municipality',
      reasons: [{ code: 'low_stability', value: 7.4 }, { code: 'leech' }],
    },
    {
      kanji: '喉',
      frame: 1768,
      keyword: 'throat',
      reasons: [
        { code: 'again_yesterday', value: 2 },
        { code: 'low_stability', value: 3.8 },
        { code: 'leech' },
      ],
    },
  ],
  sentences: [
    {
      id: 's1',
      text: '{政府[せいふ]}は{新[あたら]しい}{計画[けいかく]}を{発表[はっぴょう]}した。',
      translation: 'The government announced a new plan.',
      source: 'tatoeba',
      owner: 'example_user',
    },
    {
      id: 's2',
      text: '{占[うらな]い師[し]}の{言[い]う}ことは{嘘[うそ]}ばかりだ。',
      translation: 'Everything fortune-tellers say is lies.',
      source: 'tatoeba',
      owner: 'example_user',
    },
    {
      id: 's3',
      text: '{彼[かれ]}は{卓越[たくえつ]}した{才能[さいのう]}を{持[も]って}いる。',
      translation: 'He has outstanding talent.',
      source: 'tatoeba',
      owner: 'another_user',
    },
    {
      id: 's4',
      text: '{風邪[かぜ]}で{喉[のど]}が{痛[いた]い}。',
      translation: 'My throat hurts because of a cold.',
      source: 'tatoeba',
      owner: 'another_user',
    },
    {
      id: 's5',
      text: '{京都府[きょうとふ]}に{住[す]んで}いる{友達[ともだち]}が{遊[あそ]び}に{来[き]た}。',
      translation: 'A friend who lives in Kyoto Prefecture came to visit.',
      source: 'ai',
    },
  ],
  passage: {
    text: '{朝[あさ]}から{喉[のど]}の{調子[ちょうし]}が{悪[わる]かった}ので、{会社[かいしゃ]}を{休[やす]んで}{家[いえ]}で{過[す]ごした}。{台所[だいどころ]}の{食卓[しょくたく]}には、{母[はは]}が{置[お]いて}いった{新聞[しんぶん]}がある。{開[ひら]いて}みると、{大阪府[おおさかふ]}の{新[あたら]しい}{計画[けいかく]}についての{記事[きじ]}と、{今週[こんしゅう]}の{星占[ほしうらな]い}が{載[の]って}いた。{私[わたし]}の{星座[せいざ]}は「{無理[むり]}をせず、ゆっくり{休[やす]む}こと」だそうだ。{占[うらな]い}はあまり{信[しん]じない}が、{今日[きょう]}だけは{従[したが]う}ことにした。',
    translation:
      'My throat had felt off since the morning, so I took the day off work and stayed at home. On the kitchen table was the newspaper my mother had left. When I opened it, there was an article about Osaka Prefecture\u2019s new plan, and this week\u2019s horoscope. Mine said: don\u2019t push yourself, take it easy and rest. I don\u2019t really believe in fortune-telling, but just for today I decided to do as I was told.',
  },
  writing: [
    {
      id: 'w1',
      prompt: 'The prefectural office is next to the station.',
      answer: '{府庁[ふちょう]}は{駅[えき]}の{隣[となり]}にあります。',
      uses: ['府'],
    },
  ],
  dictionary: [
    {
      forms: ['政府'],
      reading: 'せいふ',
      meanings: ['government'],
      kanji: [
        { kanji: '政', reading: 'せい' },
        { kanji: '府', reading: 'ふ' },
      ],
    },
    {
      forms: ['新しい'],
      reading: 'あたらしい',
      meanings: ['new'],
      kanji: [{ kanji: '新', reading: 'あたら' }],
    },
    {
      forms: ['計画'],
      reading: 'けいかく',
      meanings: ['plan', 'project'],
      kanji: [
        { kanji: '計', reading: 'けい' },
        { kanji: '画', reading: 'かく' },
      ],
    },
    {
      forms: ['発表'],
      reading: 'はっぴょう',
      meanings: ['announcement', 'publication'],
      kanji: [
        { kanji: '発', reading: 'はっ', note: 'はつ, shortened' },
        { kanji: '表', reading: 'ぴょう', note: 'ひょう, sound change' },
      ],
    },
    {
      forms: ['占い師'],
      reading: 'うらないし',
      meanings: ['fortune-teller'],
      kanji: [
        { kanji: '占', reading: 'うらな' },
        { kanji: '師', reading: 'し' },
      ],
    },
    {
      forms: ['言う'],
      reading: 'いう',
      meanings: ['to say'],
      kanji: [{ kanji: '言', reading: 'い' }],
    },
    {
      forms: ['嘘'],
      reading: 'うそ',
      meanings: ['lie', 'falsehood'],
      kanji: [{ kanji: '嘘', reading: 'うそ' }],
    },
    {
      forms: ['彼'],
      reading: 'かれ',
      meanings: ['he', 'him'],
      kanji: [{ kanji: '彼', reading: 'かれ' }],
    },
    {
      forms: ['卓越'],
      reading: 'たくえつ',
      meanings: ['excellence', 'being outstanding'],
      kanji: [
        { kanji: '卓', reading: 'たく' },
        { kanji: '越', reading: 'えつ' },
      ],
    },
    {
      forms: ['才能'],
      reading: 'さいのう',
      meanings: ['talent', 'ability'],
      kanji: [
        { kanji: '才', reading: 'さい' },
        { kanji: '能', reading: 'のう' },
      ],
    },
    {
      forms: ['持って'],
      reading: 'もって',
      lemma: '持つ',
      meanings: ['to have', 'to hold'],
      kanji: [{ kanji: '持', reading: 'も' }],
    },
    {
      forms: ['風邪'],
      reading: 'かぜ',
      meanings: ['a cold'],
      wholeWordReading: true,
      kanji: [
        { kanji: '風', reading: null },
        { kanji: '邪', reading: null },
      ],
    },
    {
      forms: ['喉'],
      reading: 'のど',
      meanings: ['throat'],
      kanji: [{ kanji: '喉', reading: 'のど' }],
    },
    {
      forms: ['痛い'],
      reading: 'いたい',
      meanings: ['painful', 'sore'],
      kanji: [{ kanji: '痛', reading: 'いた' }],
    },
    {
      forms: ['京都府'],
      reading: 'きょうとふ',
      meanings: ['Kyoto Prefecture'],
      kanji: [
        { kanji: '京', reading: 'きょう' },
        { kanji: '都', reading: 'と' },
        { kanji: '府', reading: 'ふ' },
      ],
    },
    {
      forms: ['住んで'],
      reading: 'すんで',
      lemma: '住む',
      meanings: ['to live (in)'],
      kanji: [{ kanji: '住', reading: 'す' }],
    },
    {
      forms: ['友達'],
      reading: 'ともだち',
      meanings: ['friend'],
      kanji: [
        { kanji: '友', reading: 'とも' },
        { kanji: '達', reading: 'だち', note: 'たち, rendaku' },
      ],
    },
    {
      forms: ['遊び'],
      reading: 'あそび',
      lemma: '遊ぶ',
      meanings: ['to play', 'to visit (遊びに来る)'],
      kanji: [{ kanji: '遊', reading: 'あそ' }],
    },
    {
      forms: ['来た'],
      reading: 'きた',
      lemma: '来る',
      meanings: ['to come'],
      kanji: [{ kanji: '来', reading: 'き' }],
    },
    {
      forms: ['朝'],
      reading: 'あさ',
      meanings: ['morning'],
      kanji: [{ kanji: '朝', reading: 'あさ' }],
    },
    {
      forms: ['調子'],
      reading: 'ちょうし',
      meanings: ['condition', 'state (of health)'],
      kanji: [
        { kanji: '調', reading: 'ちょう' },
        { kanji: '子', reading: 'し' },
      ],
    },
    {
      forms: ['悪かった'],
      reading: 'わるかった',
      lemma: '悪い',
      meanings: ['bad'],
      kanji: [{ kanji: '悪', reading: 'わる' }],
    },
    {
      forms: ['会社'],
      reading: 'かいしゃ',
      meanings: ['company', 'work'],
      kanji: [
        { kanji: '会', reading: 'かい' },
        { kanji: '社', reading: 'しゃ' },
      ],
    },
    {
      forms: ['休んで', '休む'],
      reading: 'やすんで',
      lemma: '休む',
      meanings: ['to rest', 'to take time off'],
      kanji: [{ kanji: '休', reading: 'やす' }],
    },
    {
      forms: ['家'],
      reading: 'いえ',
      meanings: ['house', 'home'],
      kanji: [{ kanji: '家', reading: 'いえ' }],
    },
    {
      forms: ['過ごした'],
      reading: 'すごした',
      lemma: '過ごす',
      meanings: ['to spend (time)'],
      kanji: [{ kanji: '過', reading: 'す' }],
    },
    {
      forms: ['台所'],
      reading: 'だいどころ',
      meanings: ['kitchen'],
      kanji: [
        { kanji: '台', reading: 'だい' },
        { kanji: '所', reading: 'どころ', note: 'ところ, rendaku' },
      ],
    },
    {
      forms: ['食卓'],
      reading: 'しょくたく',
      meanings: ['dining table'],
      kanji: [
        { kanji: '食', reading: 'しょく' },
        { kanji: '卓', reading: 'たく' },
      ],
    },
    {
      forms: ['母'],
      reading: 'はは',
      meanings: ['mother'],
      kanji: [{ kanji: '母', reading: 'はは' }],
    },
    {
      forms: ['置いて'],
      reading: 'おいて',
      lemma: '置く',
      meanings: ['to put', 'to leave (behind)'],
      kanji: [{ kanji: '置', reading: 'お' }],
    },
    {
      forms: ['新聞'],
      reading: 'しんぶん',
      meanings: ['newspaper'],
      kanji: [
        { kanji: '新', reading: 'しん' },
        { kanji: '聞', reading: 'ぶん' },
      ],
    },
    {
      forms: ['開いて'],
      reading: 'ひらいて',
      lemma: '開く',
      meanings: ['to open'],
      kanji: [{ kanji: '開', reading: 'ひら' }],
    },
    {
      forms: ['大阪府'],
      reading: 'おおさかふ',
      meanings: ['Osaka Prefecture'],
      kanji: [
        { kanji: '大', reading: 'おお' },
        { kanji: '阪', reading: 'さか' },
        { kanji: '府', reading: 'ふ' },
      ],
    },
    {
      forms: ['記事'],
      reading: 'きじ',
      meanings: ['article', 'news story'],
      kanji: [
        { kanji: '記', reading: 'き' },
        { kanji: '事', reading: 'じ' },
      ],
    },
    {
      forms: ['今週'],
      reading: 'こんしゅう',
      meanings: ['this week'],
      kanji: [
        { kanji: '今', reading: 'こん' },
        { kanji: '週', reading: 'しゅう' },
      ],
    },
    {
      forms: ['星占い'],
      reading: 'ほしうらない',
      meanings: ['horoscope', 'astrology'],
      kanji: [
        { kanji: '星', reading: 'ほし' },
        { kanji: '占', reading: 'うらな' },
      ],
    },
    {
      forms: ['載って'],
      reading: 'のって',
      lemma: '載る',
      meanings: ['to appear (in print)'],
      kanji: [{ kanji: '載', reading: 'の' }],
    },
    {
      forms: ['私'],
      reading: 'わたし',
      meanings: ['I', 'me'],
      kanji: [{ kanji: '私', reading: 'わたし' }],
    },
    {
      forms: ['星座'],
      reading: 'せいざ',
      meanings: ['constellation', 'star sign'],
      kanji: [
        { kanji: '星', reading: 'せい' },
        { kanji: '座', reading: 'ざ' },
      ],
    },
    {
      forms: ['無理'],
      reading: 'むり',
      meanings: ['unreasonable', 'overdoing it'],
      kanji: [
        { kanji: '無', reading: 'む' },
        { kanji: '理', reading: 'り' },
      ],
    },
    {
      forms: ['占い'],
      reading: 'うらない',
      meanings: ['fortune-telling'],
      kanji: [{ kanji: '占', reading: 'うらな' }],
    },
    {
      forms: ['信じない'],
      reading: 'しんじない',
      lemma: '信じる',
      meanings: ['to believe'],
      kanji: [{ kanji: '信', reading: 'しん' }],
    },
    {
      forms: ['今日'],
      reading: 'きょう',
      meanings: ['today'],
      wholeWordReading: true,
      kanji: [
        { kanji: '今', reading: null },
        { kanji: '日', reading: null },
      ],
    },
    {
      forms: ['従う'],
      reading: 'したがう',
      meanings: ['to obey', 'to follow'],
      kanji: [{ kanji: '従', reading: 'したが' }],
    },
    {
      forms: ['府庁'],
      reading: 'ふちょう',
      meanings: ['prefectural office'],
      kanji: [
        { kanji: '府', reading: 'ふ' },
        { kanji: '庁', reading: 'ちょう' },
      ],
    },
    {
      forms: ['駅'],
      reading: 'えき',
      meanings: ['station'],
      kanji: [{ kanji: '駅', reading: 'えき' }],
    },
    {
      forms: ['隣'],
      reading: 'となり',
      meanings: ['next to', 'neighbour'],
      kanji: [{ kanji: '隣', reading: 'となり' }],
    },
  ],
  done: false,
  grades: {},
  comments: [
    {
      id: 'c1',
      body: '占 keeps turning into 古 in my head. The story needs a second look.',
      createdAt: '2026-09-27T08:12:00Z',
    },
  ],
};

// 々 repeats the kanji before it and isn't one itself.
const KANJI_CHAR = /(?!々)\p{Script=Han}/u;

function toEntry(m: MockEntry): Omit<DailyEntry, 'date' | 'studyDate'> {
  const sentences = m.sentences.map((s, i): Sentence => ({
    id: s.id,
    position: i + 1,
    tokens: parseJapanese(s.text),
    translation: s.translation,
    source: s.source,
    // No real Tatoeba ids here, so the page links to a search instead.
    sourceId: null,
    owner: s.owner ?? null,
  }));
  const passage = {
    tokens: parseJapanese(m.passage.text),
    translation: m.passage.translation,
    ai: true,
  };
  const writing = m.writing.map(w => ({
    ...w,
    answer: parseJapanese(w.answer),
  }));
  const dictionary = m.dictionary.map((d): DictionaryEntry => ({
    ...d,
    lemma: d.lemma ?? d.forms[0],
    wholeWordReading: d.wholeWordReading ?? false,
    kanji: d.kanji.map(k => ({ ...k, note: k.note ?? null })),
  }));
  // Every kanji in the entry, in the order it first appears. A kanji
  // missing from ./kanji is outside RTK.
  const text = [
    ...sentences.flatMap(s => s.tokens),
    ...passage.tokens,
    ...writing.flatMap(w => w.answer),
  ]
    .map(t => t.surface)
    .concat(dictionary.flatMap(d => d.kanji.map(k => k.kanji)))
    .concat(m.targets.map(t => t.kanji))
    .join('');
  const kanji = Object.fromEntries(
    [...text]
      .filter(c => KANJI_CHAR.test(c))
      .map((c): [string, KanjiInfo] => [
        c,
        KANJI[c]
          ? { ...KANJI[c], status: 'covered' }
          : { frame: null, keyword: null, status: 'not_in_rtk' },
      ]),
  );
  return {
    generatedAt: m.generatedAt,
    backfilled: false,
    model: m.model,
    stats: m.stats,
    summary: { text: m.summary, ai: true },
    targets: m.targets.map(t => ({
      ...t,
      story: t.story ?? null,
      comment: t.comment ?? null,
      reasons: t.reasons.map(r => ({ code: r.code, value: r.value ?? null })),
    })),
    kanji,
    sentences,
    passage,
    writing,
    dictionary,
    done: m.done,
    grades: m.grades,
    comments: m.comments,
  };
}

const entry = toEntry(mock);

const history: {
  date: string;
  reviews: number;
  targets: string[];
  done: boolean;
}[] = [
  { date: '2026-09-26', reviews: 212, targets: ['睡', '眠', '療'], done: true },
  {
    date: '2026-09-25',
    reviews: 164,
    targets: ['衰', '喪', '哀', '衷'],
    done: true,
  },
  { date: '2026-09-24', reviews: 0, targets: ['幣', '弊', '蔽'], done: false },
  { date: '2026-09-23', reviews: 238, targets: ['崇', '宗'], done: true },
  { date: '2026-09-22', reviews: 197, targets: ['徴', '微', '徹'], done: true },
  { date: '2026-09-21', reviews: 145, targets: ['揮', '輝'], done: true },
];

export function getDailyIndex(): DailySummary[] {
  const today: DailySummary = {
    date: MOCK_TODAY,
    reviews: entry.stats.reviews,
    targets: entry.targets.map(t => ({ kanji: t.kanji, keyword: t.keyword })),
    backfilled: false,
    done: entry.done,
  };
  return [
    today,
    ...history.map(h => ({
      date: h.date,
      reviews: h.reviews,
      backfilled: false,
      done: h.done,
      targets: h.targets.map(k => ({
        kanji: k,
        keyword: KANJI[k]?.keyword ?? '',
      })),
    })),
  ];
}

// Every date shows the same full entry; only the date changes.
export function getDailyEntry(date: string): DailyEntry | undefined {
  if (!getDailyIndex().some(d => d.date === date)) {
    return undefined;
  }
  const study = new Date(`${date}T00:00:00Z`);
  study.setUTCDate(study.getUTCDate() - 1);
  return { ...entry, date, studyDate: study.toISOString().slice(0, 10) };
}
