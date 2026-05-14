/**
 * @module toHighlight
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-highlight
 *
 * @remarks
 * Pure transformer — no DOM, no state, no registry, no reactivity. Splits text
 * into matched and unmatched chunks given a query string, an array of query
 * strings, or pre-computed `[start, end]` match ranges (e.g., from createFilter).
 * Returns a plain array; wrap the call in `computed()` for reactive recomputation.
 *
 * @example
 * ```ts
 * import { toHighlight } from '@vuetify/v0'
 *
 * const chunks = toHighlight('Hello World', 'World')
 * // [{ text: 'Hello ', match: false }, { text: 'World', match: true }]
 * ```
 */

// Utilities
import { toValue } from 'vue'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { MaybeRefOrGetter } from 'vue'

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
 * A contiguous chunk of source text, flagged as matched or unmatched.
 *
 * @example
 * ```ts
 * import type { HighlightChunk } from '@vuetify/v0'
 *
 * const chunk: HighlightChunk = { text: 'Hello', match: true }
 * ```
 */
export interface HighlightChunk {
  text: string
  match: boolean
}

/**
 * Optional configuration for {@link toHighlight}.
 *
 * @example
 * ```ts
 * import { toHighlight } from '@vuetify/v0'
 *
 * const chunks = toHighlight('Hello World', 'WORLD', {
 *   ignoreCase: true,
 *   matchAll: true,
 * })
 * ```
 */
export interface ToHighlightOptions {
  /**
   * Pre-computed `[start, end]` index pairs.
   * When non-empty, takes priority over `query`. `matchAll` is ignored.
   * Caller-supplied ranges are sorted and merged before chunking, so
   * unsorted or overlapping input is handled gracefully.
   */
  matches?: MaybeRefOrGetter<readonly MatchRange[] | undefined>
  /**
   * Highlight every occurrence (`true`) or only the first per term (`false`, default).
   * Ignored when `matches` is provided.
   */
  matchAll?: MaybeRefOrGetter<boolean>
  /** Case-insensitive matching. Default `false`. */
  ignoreCase?: MaybeRefOrGetter<boolean>
}

function mergeRanges (ranges: readonly MatchRange[]): MatchRange[] {
  const sorted = ranges
    .filter(span => span[0] < span[1])
    .toSorted((a, b) => a[0] - b[0])
  const merged: [number, number][] = []

  for (const span of sorted) {
    const last = merged.at(-1)
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1])
    else merged.push([span[0], span[1]])
  }

  return merged
}

function chunkText (text: string, ranges: readonly MatchRange[]): HighlightChunk[] {
  const chunks: HighlightChunk[] = []
  let cursor = 0

  for (const [start, end] of ranges) {
    if (cursor < start) chunks.push({ text: text.slice(cursor, start), match: false })
    chunks.push({ text: text.slice(start, end), match: true })
    cursor = end
  }

  if (cursor < text.length) chunks.push({ text: text.slice(cursor), match: false })

  return chunks
}

function findRanges (text: string, query: string | string[], matchAll: boolean, ignoreCase: boolean): MatchRange[] {
  const terms = toArray(query).filter(Boolean)
  const haystack = ignoreCase ? text.toLocaleLowerCase() : text
  const spans: [number, number][] = []

  for (const term of terms) {
    const needle = ignoreCase ? term.toLocaleLowerCase() : term
    let index = haystack.indexOf(needle)

    if (index !== -1) {
      spans.push([index, index + term.length])
      if (matchAll) {
        index = haystack.indexOf(needle, index + term.length)
        while (index !== -1) {
          spans.push([index, index + term.length])
          index = haystack.indexOf(needle, index + term.length)
        }
      }
    }
  }

  return mergeRanges(spans)
}

/**
 * Splits text into matched and unmatched chunks.
 *
 * Pure transformer — returns a plain array. Wrap the call in `computed()` for
 * reactive recomputation.
 *
 * Priority: `options.matches` (when non-empty) → `query` → no-match fallback.
 *
 * @param text The source string to split.
 * @param query One or more search terms. Case sensitivity controlled by `options.ignoreCase`.
 * @param options Optional `matches`, `matchAll`, `ignoreCase`.
 * @returns A `HighlightChunk[]` array.
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-highlight
 *
 * @example
 * ```ts
 * import { computed, shallowRef } from 'vue'
 * import { toHighlight } from '@vuetify/v0'
 *
 * const query = shallowRef('World')
 * const chunks = computed(() => toHighlight('Hello World', query))
 *
 * console.log(chunks.value)
 * // [{ text: 'Hello ', match: false }, { text: 'World', match: true }]
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function toHighlight (
  text: MaybeRefOrGetter<string>,
  query?: MaybeRefOrGetter<string | string[] | undefined>,
  options: ToHighlightOptions = {},
): HighlightChunk[] {
  const _text = toValue(text)
  const _query = toValue(query)
  const _matches = toValue(options.matches)
  const matchAll = toValue(options.matchAll) ?? false
  const ignoreCase = toValue(options.ignoreCase) ?? false

  if (_matches?.length) return chunkText(_text, mergeRanges(_matches))

  if (_query) {
    const ranges = findRanges(_text, _query, matchAll, ignoreCase)
    return ranges.length > 0 ? chunkText(_text, ranges) : [{ text: _text, match: false }]
  }

  return [{ text: _text, match: false }]
}
