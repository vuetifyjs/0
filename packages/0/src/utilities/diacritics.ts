/**
 * @module utilities/diacritics
 *
 * @remarks
 * Accent-folding search primitives. Pure string transforms — no DOM, no state,
 * no reactivity. Powers the `ignoreAccents` option of `toHighlight` and any
 * filter that wants a plain query to reach accented text.
 */

/**
 * Which side of a comparison has its accents folded before matching.
 *
 * - `'query'` — only the query, so typing `café` finds plain `cafe`
 * - `'target'` — only the text, so typing `cafe` finds accented `café`
 * - `true` — both sides
 * - `false` — neither
 *
 * @example
 * ```ts
 * import type { IgnoreAccents } from '@vuetify/v0'
 *
 * const ignoreAccents: IgnoreAccents = 'target'
 * ```
 */
export type IgnoreAccents = boolean | 'query' | 'target'

const COMBINING_MARKS = /[\u0300-\u036F]/g

// Letters that carry no combining mark, so NFD leaves them untouched.
const SPECIAL_LETTERS: Record<string, string> = {
  ł: 'l',
  ø: 'o',
  đ: 'd',
  ð: 'd',
  þ: 'th',
  ħ: 'h',
  ŧ: 't',
  ŋ: 'n',
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ı: 'i',
  Ł: 'L',
  Ø: 'O',
  Đ: 'D',
  Ð: 'D',
  Þ: 'Th',
  Ħ: 'H',
  Ŧ: 'T',
  Ŋ: 'N',
  ẞ: 'Ss',
  Æ: 'Ae',
  Œ: 'Oe',
}

const SPECIAL_LETTER = /* @__PURE__ */ new RegExp(`[${Object.keys(SPECIAL_LETTERS).join('')}]`, 'g')

function fold (str: string): string {
  return str
    .normalize('NFD')
    .replace(COMBINING_MARKS, '')
    .replace(SPECIAL_LETTER, char => SPECIAL_LETTERS[char]!)
}

// Folds per code point and records the source index each output unit came from,
// so ranges found in the folded string can be mapped back onto the original.
// Both decomposition and lowercasing change length, so a straight indexOf on the
// folded string would otherwise report misaligned indices.
function foldWithMap (str: string, ignoreCase: boolean) {
  let folded = ''
  const map: number[] = []
  let index = 0

  for (const char of str) {
    const chunk = fold(ignoreCase ? char.toLocaleLowerCase() : char)

    folded += chunk

    // One entry per code unit, not per code point — an astral char folds to
    // itself and still occupies two positions in `folded`.
    for (let unit = 0; unit < chunk.length; unit++) map.push(index)

    index += char.length
  }

  map.push(str.length)

  return { folded, map }
}

function collect (haystack: string, needle: string, matchAll: boolean): [number, number][] {
  const ranges: [number, number][] = []
  let index = haystack.indexOf(needle)

  while (index !== -1) {
    ranges.push([index, index + needle.length])

    if (!matchAll) break

    index = haystack.indexOf(needle, index + needle.length)
  }

  return ranges
}

/**
 * Finds `[start, end]` index pairs where `query` occurs in `text`, optionally
 * folding accents on either side. Returned indices always address the original
 * `text`, even when folding changed its length.
 *
 * @param text The string to search.
 * @param query The term to look for. An empty query yields no ranges.
 * @param options Optional `ignoreCase`, `ignoreAccents`, `matchAll`.
 * @returns Ranges into `text`, where `end` is exclusive.
 *
 * @example
 * ```ts
 * import { findMatchRanges } from '@vuetify/v0'
 *
 * findMatchRanges('Zürich', 'zurich', { ignoreCase: true, ignoreAccents: true })
 * // [[0, 6]]
 *
 * findMatchRanges('Łódź', 'Lo', { ignoreAccents: 'target' })
 * // [[0, 2]]
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function findMatchRanges (
  text: string,
  query: string,
  options: {
    ignoreCase?: boolean
    ignoreAccents?: IgnoreAccents
    matchAll?: boolean
  } = {},
): [number, number][] {
  const {
    ignoreCase = false,
    ignoreAccents = false,
    matchAll = false,
  } = options

  const foldQuery = ignoreAccents === true || ignoreAccents === 'query'
  const foldTarget = ignoreAccents === true || ignoreAccents === 'target'

  let needle = foldQuery ? fold(query) : query

  if (ignoreCase) {
    needle = needle.toLocaleLowerCase()
  }

  if (needle.length === 0) {
    return []
  }

  if (!foldTarget) {
    const haystack = ignoreCase ? text.toLocaleLowerCase() : text

    return collect(haystack, needle, matchAll)
  }

  const { folded, map } = foldWithMap(text, ignoreCase)

  return collect(folded, needle, matchAll)
    .map(([start, end]) => [map[start]!, map[end]!])
}
