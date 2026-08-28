/**
 * @module utilities/diacritics
 *
 * @remarks
 * Accent-folding search primitives. Pure string transforms — no DOM, no state,
 * no reactivity. Powers the `ignoreAccents` option of `toHighlight` and any
 * filter that wants a plain query to reach accented text.
 */

/**
 * A `[start, end]` index pair where `end` is exclusive (matches
 * `String.prototype.slice` convention).
 *
 * @example
 * ```ts
 * import type { MatchRange } from '@vuetify/v0'
 *
 * const ranges: MatchRange[] = [[0, 5], [12, 17]]
 * ```
 */
export type MatchRange = readonly [number, number]

/**
 * Which side of a comparison has its accents folded before matching.
 *
 * - `'query'` — folds the query, so typing `café` finds plain `cafe`
 * - `'target'` — folds the text, so typing `cafe` finds accented `café`
 * - `true` — both sides fold, so any accent variant matches any other
 * - `false` — neither folds, exact match only
 *
 * `'query'` and `'target'` fold only one side, but a spelling that already
 * agrees on both sides still matches verbatim — folding one side never
 * hides a match the other side already has. They still don't fold each
 * other's accents together, so `café` won't match `cafè` under either.
 */
export type IgnoreAccents = boolean | 'query' | 'target'

export interface FindMatchRangesOptions {
  ignoreCase?: boolean
  ignoreAccents?: IgnoreAccents
  matchAll?: boolean
}

const COMBINING_MARKS = /[\u0300-\u036F]/g
const FINAL_SIGMA = /ς/g

// ς is σ when used at the end of a word - both uppercase to Σ
// a per-character loop with casing change cannot see it
function lower (str: string): string {
  return str.toLowerCase().replace(FINAL_SIGMA, 'σ')
}

// No canonical NFD decomposition, so they need a manual map.
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

// Records the source index each output unit came from, so ranges found in the
// transformed string can be mapped back onto the original. Mark-stripping,
// special-letter expansion (ß→ss), and toLowerCase (İ→i̇) all change length.
function foldWithMap (str: string, ignoreCase: boolean, foldAccents: boolean) {
  let folded = ''
  const map: number[] = []
  let index = 0

  for (const char of str) {
    const raw = ignoreCase ? lower(char) : char
    const chunk = foldAccents ? fold(raw) : raw

    folded += chunk

    // Map per UTF-16 unit — emoji stay two units; some astral CJK compat
    // ideographs NFD to one BMP unit.
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

// Exclusive end in source space is the start of the next source character
// after the last consumed folded unit. Ending mid-expansion (s vs ß→ss)
// therefore spans the whole source character instead of emitting [i, i].
function remap (map: number[], start: number, end: number): MatchRange {
  const sourceStart = map[start]!
  let sourceEnd = map[end]!

  if (end > 0 && map[end] === map[end - 1]) {
    let index = end
    const current = map[end]!

    while (index < map.length && map[index] === current) index++

    sourceEnd = map[index]!
  }

  return [sourceStart, sourceEnd]
}

function project (ranges: readonly [number, number][], map: number[]): MatchRange[] {
  const projected: MatchRange[] = []

  for (const [start, end] of ranges) {
    const span = remap(map, start, end)
    const last = projected.at(-1)

    if (!last || last[0] !== span[0] || last[1] !== span[1]) projected.push(span)
  }

  return projected
}

function search (
  text: string,
  query: string,
  ignoreCase: boolean,
  foldQuery: boolean,
  foldTarget: boolean,
  matchAll: boolean,
): MatchRange[] {
  const folded = foldQuery ? fold(query) : query
  const needle = ignoreCase ? lower(folded) : folded

  if (needle.length === 0) {
    return []
  }

  if (!foldTarget) {
    if (!ignoreCase) {
      return collect(text, needle, matchAll)
    }

    const lowered = lower(text)
    if (lowered.length === text.length) {
      return collect(lowered, needle, matchAll)
    }
  }

  const { folded: haystack, map } = foldWithMap(text, ignoreCase, foldTarget)

  return project(collect(haystack, needle, matchAll), map)
}

function mergeRanges (a: readonly MatchRange[], b: readonly MatchRange[]): MatchRange[] {
  const combined = [...a, ...b].toSorted((x, y) => x[0] - y[0] || x[1] - y[1])
  const merged: MatchRange[] = []

  for (const range of combined) {
    const last = merged.at(-1)
    if (last && range[0] < last[1]) continue

    merged.push(range)
  }

  return merged
}

/**
 * Finds `[start, end]` index pairs where `query` occurs in `text`, optionally
 * folding accents on either side. Returned indices always address the original
 * `text`, even when folding or case-conversion changed its length.
 *
 * Directional folding (`'query'` or `'target'`) only transforms one side, but
 * a spelling that's already identical on both sides — accents and all — is
 * merged in verbatim, so folding one side never hides a match the other side
 * already has.
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
 *
 * findMatchRanges('… Kraków …', 'Kraków', { ignoreAccents: 'query' })
 * // [[4, 10]] — typing the exact accented name always finds itself
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function findMatchRanges (
  text: string,
  query: string,
  options: FindMatchRangesOptions = {},
): MatchRange[] {
  const {
    ignoreCase = false,
    ignoreAccents = false,
    matchAll = false,
  } = options

  const foldQuery = ignoreAccents === true || ignoreAccents === 'query'
  const foldTarget = ignoreAccents === true || ignoreAccents === 'target'

  if (foldQuery === foldTarget) {
    return search(text, query, ignoreCase, foldQuery, foldTarget, matchAll)
  }

  const exact = search(text, query, ignoreCase, false, false, true)
  const folded = search(text, query, ignoreCase, foldQuery, foldTarget, true)
  const merged = mergeRanges(exact, folded)

  return matchAll ? merged : merged.slice(0, 1)
}
