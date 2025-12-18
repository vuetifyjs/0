/**
 * @module useHotkey
 *
 * @remarks
 * Hotkey listener composable with key combination and sequence support.
 *
 * Key features:
 * - Key combination support (`ctrl+k`, `shift+enter`)
 * - Key sequence support (`g-h` for GitHub-style shortcuts)
 * - Platform-aware modifiers (Mac: cmd→meta, others: cmd→ctrl)
 * - Input focus detection (skip when typing in inputs)
 * - Sequence timeout with automatic reset
 * - Key alias normalization
 * - Automatic cleanup on scope disposal
 *
 * Sibling to useKeydown - use useKeydown for simple exact key matching,
 * useHotkey for complex hotkey parsing with sequences and modifiers.
 */

// Composables
import { useWindowEventListener } from '#v0/composables/useEventListener'

// Utilities
import { splitKeyCombination, splitKeySequence, MODIFIERS } from './parsing'
import { onScopeDispose, toValue, watch } from 'vue'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { MaybeRefOrGetter } from 'vue'

export interface UseHotkeyOptions {
  /**
   * The keyboard event type to listen for.
   * @default 'keydown'
   */
  event?: MaybeRefOrGetter<'keydown' | 'keyup'>
  /**
   * Whether to trigger the callback when an input element is focused.
   * @default false
   */
  inputs?: MaybeRefOrGetter<boolean>
  /**
   * Whether to prevent the default browser action.
   * @default true
   */
  preventDefault?: MaybeRefOrGetter<boolean>
  /**
   * Timeout in ms before a key sequence resets.
   * @default 1000
   */
  sequenceTimeout?: MaybeRefOrGetter<number>
}

/**
 * A composable that listens for hotkey combinations and sequences.
 *
 * @param keys - The hotkey string (e.g., 'ctrl+k', 'g-h')
 * @param callback - The function to call when the hotkey is triggered
 * @param options - Configuration options
 * @returns A cleanup function to remove the listener
 *
 * @see https://0.vuetifyjs.com/composables/system/use-hotkey
 *
 * @example
 * ```ts
 * import { useHotkey } from '@vuetify/v0'
 *
 * // Simple combination
 * useHotkey('ctrl+k', () => console.log('Command palette opened'))
 *
 * // Key sequence (GitHub-style)
 * useHotkey('g-h', () => console.log('Go home'))
 *
 * // With options
 * useHotkey('escape', closeModal, { inputs: true })
 * ```
 */
export function useHotkey (
  keys: MaybeRefOrGetter<string | undefined>,
  callback: (e: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): () => void {
  if (!IN_BROWSER) return () => {}

  const {
    event = 'keydown',
    inputs = false,
    preventDefault = true,
    sequenceTimeout = 1000,
  } = options

  const isMac = navigator?.userAgent?.includes('Macintosh') ?? false
  let timeout = 0
  let keyGroups: string[] = []
  let isSequence = false
  let groupIndex = 0
  let cleanup: (() => void) | null = null

  function isInputFocused (): boolean {
    if (toValue(inputs)) return false

    const activeElement = document.activeElement as HTMLElement

    return !!activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable ||
      activeElement.contentEditable === 'true'
    )
  }

  function resetSequence () {
    groupIndex = 0
    clearTimeout(timeout)
  }

  function handler (e: KeyboardEvent) {
    const group = keyGroups[groupIndex]

    if (!group || isInputFocused()) return

    if (!matchesKeyGroup(e, group, isMac)) {
      if (isSequence) resetSequence()
      return
    }

    if (toValue(preventDefault)) e.preventDefault()

    if (!isSequence) {
      callback(e)
      return
    }

    clearTimeout(timeout)
    groupIndex++

    if (groupIndex === keyGroups.length) {
      callback(e)
      resetSequence()
      return
    }

    timeout = window.setTimeout(resetSequence, toValue(sequenceTimeout))
  }

  function stop () {
    if (cleanup) {
      cleanup()
      cleanup = null
    }
    clearTimeout(timeout)
  }

  watch(() => toValue(keys), newKeys => {
    stop()

    if (newKeys) {
      const groups = splitKeySequence(newKeys.toLowerCase())
      isSequence = groups.length > 1
      keyGroups = groups
      resetSequence()
      cleanup = useWindowEventListener(toValue(event), handler)
    }
  }, { immediate: true })

  // Watch for changes in the event type to re-register the listener
  watch(() => toValue(event), (newEvent, oldEvent) => {
    if (oldEvent && keyGroups.length > 0) {
      stop()
      cleanup = useWindowEventListener(newEvent, handler)
    }
  })

  onScopeDispose(stop, true)

  return stop
}

function matchesKeyGroup (e: KeyboardEvent, group: string, isMac: boolean): boolean {
  const { modifiers, actualKey } = parseKeyGroup(group)

  const expectCtrl = modifiers.ctrl || (!isMac && (modifiers.cmd || modifiers.meta))
  const expectMeta = isMac && (modifiers.cmd || modifiers.meta)

  return (
    e.ctrlKey === expectCtrl &&
    e.metaKey === expectMeta &&
    e.shiftKey === modifiers.shift &&
    e.altKey === modifiers.alt &&
    e.key.toLowerCase() === actualKey?.toLowerCase()
  )
}

interface ParsedKeyGroup {
  modifiers: Record<string, boolean>
  actualKey: string | undefined
}

function parseKeyGroup (group: string): ParsedKeyGroup {
  const { keys: parts } = splitKeyCombination(group.toLowerCase())

  // If the combination is invalid, return empty result
  if (parts.length === 0) {
    return {
      modifiers: Object.fromEntries(MODIFIERS.map(m => [m, false])),
      actualKey: undefined,
    }
  }

  const modifiers = Object.fromEntries(MODIFIERS.map(m => [m, false])) as Record<string, boolean>
  let actualKey: string | undefined

  for (const part of parts) {
    if ((MODIFIERS as readonly string[]).includes(part)) {
      modifiers[part] = true
    } else {
      actualKey = part
    }
  }

  return { modifiers, actualKey }
}

// Re-export utilities for advanced usage
export { keyAliasMap, normalizeKey } from './aliases'
export { MODIFIERS, splitKeyCombination, splitKeySequence } from './parsing'
