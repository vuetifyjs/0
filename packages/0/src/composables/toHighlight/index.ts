/**
 * @module toHighlight
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-highlight
 *
 * @remarks
 * Pure transformer — no DOM, no state, no registry. Splits text into matched and
 * unmatched chunks given a query string, an array of query strings, or pre-computed
 * `[start, end]` match ranges (e.g., from createFilter).
 *
 * @example
 * ```ts
 * import { toHighlight } from '@vuetify/v0'
 *
 * const chunks = toHighlight({
 *   text: 'Hello World',
 *   query: 'world',
 * })
 * console.log(chunks.value)
 * // [{ text: 'Hello ', match: false }, { text: 'World', match: true }]
 * ```
 */

// Utilities
import { computed, toValue } from 'vue'

// Types
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

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
export type MatchRange = [number, number]

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
 * Options accepted by {@link toHighlight}.
 *
 * @example
 * ```ts
 * import { toHighlight } from '@vuetify/v0'
 *
 * const chunks = toHighlight({
 *   text: () => props.text,
 *   query: () => props.query,
 *   ignoreCase: false,
 *   matchAll: false,
 * })
 * ```
 */
export interface ToHighlightOptions {
  /** The source string to split into chunks. */
  text: MaybeRefOrGetter<string>
  /** One or more search terms. Case sensitivity controlled by `ignoreCase`. */
  query?: MaybeRefOrGetter<string | string[] | undefined>
  /**
   * Pre-computed `[start, end]` index pairs.
   * When non-empty, takes priority over `query`. `matchAll` is ignored.
   * Caller-supplied ranges are sorted and merged before chunking, so
   * unsorted or overlapping input is handled gracefully.
   */
  matches?: MaybeRefOrGetter<MatchRange[] | undefined>
  /**
   * Highlight every occurrence (`true`, default) or only the first per term (`false`).
   * Ignored when `matches` is provided.
   */
  matchAll?: MaybeRefOrGetter<boolean>
  /** Case-insensitive matching. Default `true`. */
  ignoreCase?: MaybeRefOrGetter<boolean>
}

function mergeRanges (ranges: MatchRange[]): MatchRange[] {
  const sorted = ranges
    .filter(span => span[0] < span[1])
    .toSorted((a, b) => a[0] - b[0])
  const merged: MatchRange[] = []

  for (const span of sorted) {
    const last = merged.at(-1)
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1])
    else merged.push([span[0], span[1]])
  }

  return merged
}

function chunkText (text: string, ranges: MatchRange[]): HighlightChunk[] {
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
  const terms = (Array.isArray(query) ? query : [query]).filter(Boolean)
  const haystack = ignoreCase ? text.toLocaleLowerCase() : text
  const spans: MatchRange[] = []

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
 * Priority: `matches` (when non-empty) → `query` → no-match fallback.
 *
 * @param options Source text plus optional `query`, `matches`, `matchAll`, `ignoreCase`.
 * @returns A `ComputedRef<HighlightChunk[]>` that recomputes when any reactive input changes.
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-highlight
 *
 * @example
 * ```ts
 * import { shallowRef } from 'vue'
 * import { toHighlight } from '@vuetify/v0'
 *
 * const query = shallowRef('world')
 * const chunks = toHighlight({ text: 'Hello World', query })
 *
 * console.log(chunks.value)
 * // [{ text: 'Hello ', match: false }, { text: 'World', match: true }]
 * ```
 */
/* #__NO_SIDE_EFFECTS__ */
export function toHighlight (options: ToHighlightOptions): ComputedRef<HighlightChunk[]> {
  return computed<HighlightChunk[]>(() => {
    const text = toValue(options.text)
    const matches = toValue(options.matches)
    const query = toValue(options.query)
    const matchAll = toValue(options.matchAll) ?? true
    const ignoreCase = toValue(options.ignoreCase) ?? true

    if (matches?.length) return chunkText(text, mergeRanges(matches))

    if (query) {
      const ranges = findRanges(text, query, matchAll, ignoreCase)
      return ranges.length > 0 ? chunkText(text, ranges) : [{ text, match: false }]
    }

    return [{ text, match: false }]
  })
}
