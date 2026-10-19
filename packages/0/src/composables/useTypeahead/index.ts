/**
 * @module useTypeahead
 *
 * @see https://0.vuetifyjs.com/composables/system/use-typeahead
 *
 * @remarks
 * Prefix matcher for typed characters. Characters accumulate until the
 * inactivity window elapses. A repeated letter cycles to the next item
 * with the same prefix. The composable returns the match — it does not
 * select, filter, open a menu, or read the DOM.
 *
 * @example
 * ```ts
 * import { useTypeahead } from '@vuetify/v0'
 *
 * const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona']
 * const { typeahead, reset } = useTypeahead(() => states, {
 *   text: state => state,
 * })
 *
 * typeahead('a') // Alabama
 * typeahead('m') // American Samoa
 * reset()
 * ```
 */

// Composables
import { useTimer } from '#v0/composables/useTimer'

// Utilities
import { isUndefined } from '#v0/utilities'

// Types
import type { MaybeRefOrGetter } from 'vue'

/**
 * Configuration for a typeahead lookup.
 *
 * @example
 * ```ts
 * const lookup = useTypeahead(items, {
 *   text: item => item.title,
 *   duration: 1000,
 * })
 * ```
 */
export interface TypeaheadOptions<T> {
  /**
   * Text used for prefix matching. Read on every key.
   *
   * @example
   * ```ts
   * useTypeahead(items, { text: item => item.title })
   * ```
   */
  text: (item: T) => string
  /**
   * Inactivity window before the buffer clears, in milliseconds.
   * Accepts a plain number, ref, or getter — read fresh on each key.
   *
   * @default 1000
   *
   * @example
   * ```ts
   * useTypeahead(items, { text: item => item.title, duration: 700 })
   * ```
   */
  duration?: MaybeRefOrGetter<number>
}

/**
 * A matched item and its index in the list passed to `typeahead`.
 *
 * @example
 * ```ts
 * const match: TypeaheadMatch<string> = { item: 'Alaska', index: 1 }
 * ```
 */
export interface TypeaheadMatch<T> {
  /** The matched item. */
  item: T
  /** Index of `item` in the current list. */
  index: number
}

export interface TypeaheadReturn<T> {
  /**
   * Append `char` to the buffer and return the next prefix match.
   * Restarts the inactivity window on every call, hit or miss.
   *
   * @example
   * ```ts
   * const match = typeahead('a')
   * ```
   */
  typeahead: (char: string) => TypeaheadMatch<T> | undefined
  /**
   * Clear the buffer and stop the inactivity window.
   *
   * @example
   * ```ts
   * reset()
   * ```
   */
  reset: () => void
}

/**
 * Match typed characters against a list.
 *
 * `items` is read on every key, in the order given. Matching is a
 * case-insensitive `startsWith` against `options.text`. Text is not trimmed.
 * Disabled items are not skipped — omit them from `items` to filter.
 *
 * @param items List to search, in match order.
 * @param options Text getter and inactivity window.
 * @returns `typeahead` and `reset`.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-typeahead
 *
 * @example
 * ```ts
 * const { typeahead, reset } = useTypeahead(
 *   () => tickets.value,
 *   { text: ticket => ticket.label, duration: 1000 },
 * )
 *
 * const match = typeahead('b')
 * reset()
 * ```
 */
export function useTypeahead<T> (
  items: () => readonly T[],
  options: TypeaheadOptions<T>,
): TypeaheadReturn<T> {
  const { text, duration = 1000 } = options

  let prefix = ''
  let index = 0

  function clear () {
    prefix = ''
    index = 0
  }

  const timer = useTimer(clear, { duration })

  function repeated (value: string) {
    const earlier = value.at(-2)
    return !isUndefined(earlier) && earlier === value.at(-1)
  }

  function find (list: readonly T[], from: number, query: string): TypeaheadMatch<T> | undefined {
    for (let i = from; i < list.length; i++) {
      const item = list[i]
      if (isUndefined(item)) continue
      if (text(item).toLowerCase().startsWith(query)) return { item, index: i }
    }

    return undefined
  }

  /**
   * Append `char` to the buffer and return the next prefix match.
   *
   * @example
   * ```ts
   * const match = typeahead('a')
   * ```
   */
  function typeahead (char: string): TypeaheadMatch<T> | undefined {
    const key = char.toLowerCase()
    prefix += key

    const list = items()
    let match = find(list, index, prefix)

    // A repeated letter cycles to the next item with that prefix.
    if (isUndefined(match) && repeated(prefix)) {
      prefix = prefix.slice(0, -1)
      index++
      match = find(list, index, prefix)
    }

    if (isUndefined(match)) {
      index = 0
      match = find(list, 0, prefix)
    }

    if (isUndefined(match)) {
      prefix = key
      index = 0
      match = find(list, 0, prefix)
    }

    timer.start()

    if (isUndefined(match)) return undefined

    index = match.index
    return match
  }

  /**
   * Clear the buffer and stop the inactivity window.
   *
   * @example
   * ```ts
   * reset()
   * ```
   */
  function reset () {
    prefix = ''
    index = 0
    timer.stop()
  }

  return { typeahead, reset }
}
