// Parses the markup described in ./types: {word} groups a word, and a kanji
// run inside it is followed by its reading, e.g. {占[うらな]い師[し]}.

export type Part = { text: string; reading?: string };

export type Segment =
  | { kind: 'text'; text: string }
  | { kind: 'word'; surface: string; parts: Part[] };

const WORD = /\{([^}]*)\}/g;
const PART =
  /([\p{Script=Han}々]+)\[([^\]]+)\]|([^[\]]+?)(?=[\p{Script=Han}々]+\[|$)/gu;

export function parseJapanese(markup: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const match of markup.matchAll(WORD)) {
    if (match.index > last) {
      segments.push({ kind: 'text', text: markup.slice(last, match.index) });
    }
    const parts = [...match[1].matchAll(PART)].map(
      ([, base, reading, kana]): Part =>
        base ? { text: base, reading } : { text: kana },
    );
    segments.push({
      kind: 'word',
      surface: parts.map(p => p.text).join(''),
      parts,
    });
    last = match.index + match[0].length;
  }
  if (last < markup.length) {
    segments.push({ kind: 'text', text: markup.slice(last) });
  }
  return segments;
}
