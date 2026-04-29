/**
 * @module toHighlight
 *
 * @see https://0.vuetifyjs.com/composables/transformers/to-highlight
 *
 * @remarks
 * Pure transformer — no DOM, no state, no registry. Splits text into matched and
 * unmatched chunks given a query string, an array of query strings, or pre-computed
 * `[start, end]` match ranges (e.g., from createFilter).
 */

// Utilities
import { computed, toValue } from 'vue'

// Types
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

export type MatchRange = [number, number]

export interface HighlightChunk {
  text: string
  match: boolean
}

export interface ToHighlightOptions {
  /** The source string to split into chunks. */
  text: MaybeRefOrGetter<string>
  /** One or more search terms. Case sensitivity controlled by `ignoreCase`. */
  query?: MaybeRefOrGetter<string | string[] | undefined>
  /**
   * Pre-computed `[start, end]` index pairs.
   * When non-empty, takes priority over `query`. `matchAll` is ignored.
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
    let i = haystack.indexOf(needle)

    if (i !== -1) {
      spans.push([i, i + term.length])
      if (matchAll) {
        i = haystack.indexOf(needle, i + term.length)
        while (i !== -1) {
          spans.push([i, i + term.length])
          i = haystack.indexOf(needle, i + term.length)
        }
      }
    }
  }

  spans.sort((a, b) => a[0] - b[0])

  const merged: MatchRange[] = []
  for (const span of spans) {
    const last = merged.at(-1)
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1])
    else merged.push([...span])
  }

  return merged
}

export function toHighlight (options: ToHighlightOptions): ComputedRef<HighlightChunk[]> {
  return computed<HighlightChunk[]>(() => {
    const text = toValue(options.text)
    const matches = toValue(options.matches)
    const query = toValue(options.query)
    const matchAll = toValue(options.matchAll) ?? true
    const ignoreCase = toValue(options.ignoreCase) ?? true

    if (matches?.length) return chunkText(text, matches)

    if (query) {
      const ranges = findRanges(text, query, matchAll, ignoreCase)
      return ranges.length > 0 ? chunkText(text, ranges) : [{ text, match: false }]
    }

    return [{ text, match: false }]
  })
}
