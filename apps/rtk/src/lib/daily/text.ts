// Turns the mock's hand-written markup into tokens. {word} groups a word, and
// a kanji run inside it is followed by its reading, e.g. {占[うらな]い師[し]}.
// Text outside braces becomes plain tokens. The markup has no lemmas, so a
// token's lemma is its surface.
import type { Token, TokenPart } from './types';

const PART =
  /([\p{Script=Han}々]+)\[([^\]]+)\]|([^[\]]+?)(?=[\p{Script=Han}々]+\[|$)/gu;

export function parseJapanese(markup: string): Token[] {
  return markup
    .split(/(\{[^}]*\})/)
    .filter(Boolean)
    .map(piece => {
      if (!piece.startsWith('{')) {
        return {
          surface: piece,
          lemma: piece,
          reading: null,
          parts: [{ text: piece, reading: null }],
        };
      }
      const parts = [...piece.slice(1, -1).matchAll(PART)].map(
        ([, base, reading, kana]): TokenPart =>
          base ? { text: base, reading } : { text: kana, reading: null },
      );
      const surface = parts.map(p => p.text).join('');
      return {
        surface,
        lemma: surface,
        reading: parts.some(p => p.reading)
          ? parts.map(p => p.reading ?? p.text).join('')
          : null,
        parts,
      };
    });
}
