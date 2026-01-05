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
 * - Pause/resume/stop functionality
 * - Automatic cleanup on scope disposal
 * - SSR-safe (no-op when not in browser)
 *
 * Sibling to useKeydown - use useKeydown for simple exact key matching,
 * useHotkey for complex hotkey parsing with sequences and modifiers.
 */

// Composables
import { useWindowEventListener } from '#v0/composables/useEventListener'

// Utilities
import { onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'
import { splitKeyCombination, splitKeySequence, MODIFIERS, type Modifier } from './parsing'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { MaybeRefOrGetter, Ref } from 'vue'

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
   * Whether to stop event propagation.
   * @default false
   */
  stopPropagation?: MaybeRefOrGetter<boolean>
  /**
   * Timeout in ms before a key sequence resets.
   * @default 1000
   */
  sequenceTimeout?: MaybeRefOrGetter<number>
}

export interface UseHotkeyReturn {
  /**
   * Whether the hotkey listener is currently active (listening for keys).
   * False when paused, when keys is undefined, or in SSR.
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Whether the hotkey listener is currently paused.
   */
  readonly isPaused: Readonly<Ref<boolean>>
  /**
   * Pause listening (removes listener but keeps configuration).
   */
  pause: () => void
  /**
   * Resume listening after pause.
   */
  resume: () => void
  /**
   * Stop listening and clean up (removes listener).
   */
  stop: () => void
}

// Cache platform detection at module level (includes iOS/iPadOS for Apple keyboard support)
const isMac = IN_BROWSER && /mac|iphone|ipad|ipod/i.test(navigator?.userAgent ?? '')

/**
 * A composable that listens for hotkey combinations and sequences.
 *
 * @param keys - The hotkey string (e.g., 'ctrl+k', 'g-h')
 * @param callback - The function to call when the hotkey is triggered
 * @param options - Configuration options
 * @returns An object with state refs and control methods
 *
 * @see https://0.vuetifyjs.com/composables/system/use-hotkey
 *
 * @example
 * ```ts
 * import { useHotkey } from '@vuetify/v0'
 *
 * // Simple combination
 * const { isActive, pause, resume } = useHotkey('ctrl+k', () => {
 *   console.log('Command palette opened')
 * })
 *
 * // Key sequence (GitHub-style)
 * useHotkey('g-h', () => console.log('Go home'))
 *
 * // With options
 * useHotkey('escape', closeModal, { inputs: true })
 *
 * // Pause/resume control
 * pause()  // Temporarily disable
 * resume() // Re-enable
 * ```
 */
export function useHotkey (
  keys: MaybeRefOrGetter<string | undefined>,
  callback: (e: KeyboardEvent) => void,
  options: UseHotkeyOptions = {},
): UseHotkeyReturn {
  const {
    event = 'keydown',
    inputs = false,
    preventDefault = true,
    stopPropagation = false,
    sequenceTimeout = 1000,
  } = options

  const isPaused = shallowRef(false)
  const cleanupRef = shallowRef<(() => void) | null>(null)
  const isActive = toRef(() => cleanupRef.value !== null)

  let sequenceTimer: ReturnType<typeof setTimeout> | undefined
  let keyGroups: string[] = []
  let isSequence = false
  let groupIndex = 0

  function isInputFocused (): boolean {
    if (toValue(inputs)) return false

    const activeElement = document.activeElement as HTMLElement | null
    if (!activeElement) return false

    return (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable ||
      activeElement.contentEditable === 'true'
    )
  }

  function resetSequence () {
    groupIndex = 0
    clearTimeout(sequenceTimer)
  }

  function handler (e: KeyboardEvent) {
    const group = keyGroups[groupIndex]

    if (!group || isInputFocused()) return

    if (!matchesKeyGroup(e, group)) {
      if (isSequence) resetSequence()
      return
    }

    if (toValue(stopPropagation)) e.stopPropagation()
    if (toValue(preventDefault)) e.preventDefault()

    if (!isSequence) {
      callback(e)
      return
    }

    clearTimeout(sequenceTimer)
    groupIndex++

    if (groupIndex === keyGroups.length) {
      callback(e)
      resetSequence()
      return
    }

    sequenceTimer = setTimeout(resetSequence, toValue(sequenceTimeout))
  }

  function setup () {
    if (!IN_BROWSER || isPaused.value) return

    const currentKeys = toValue(keys)
    if (!currentKeys) return

    const groups = splitKeySequence(currentKeys.toLowerCase())
    if (groups.length === 0) return

    isSequence = groups.length > 1
    keyGroups = groups
    resetSequence()

    cleanupRef.value = useWindowEventListener(toValue(event), handler)
  }

  function teardown () {
    if (cleanupRef.value) {
      cleanupRef.value()
      cleanupRef.value = null
    }
    clearTimeout(sequenceTimer)
    keyGroups = []
    isSequence = false
    groupIndex = 0
  }

  function pause () {
    isPaused.value = true
    teardown()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    teardown()
  }

  watch(() => toValue(keys), () => {
    if (isPaused.value) return
    teardown()
    setup()
  }, { immediate: true })

  watch(() => toValue(event), () => {
    if (isPaused.value || !toValue(keys)) return
    teardown()
    setup()
  })

  onScopeDispose(stop, true)

  return {
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}

interface ParsedKeyGroup {
  modifiers: Record<Modifier, boolean>
  actualKey: string | undefined
}

function isModifier (key: string): key is Modifier {
  return (MODIFIERS as readonly string[]).includes(key)
}

function parseKeyGroup (group: string): ParsedKeyGroup {
  const { keys: parts } = splitKeyCombination(group.toLowerCase())

  const modifiers = Object.fromEntries(
    MODIFIERS.map(m => [m, false]),
  ) as Record<Modifier, boolean>

  if (parts.length === 0) {
    return { modifiers, actualKey: undefined }
  }

  let actualKey: string | undefined

  for (const part of parts) {
    if (isModifier(part)) {
      modifiers[part] = true
    } else {
      actualKey = part
    }
  }

  return { modifiers, actualKey }
}

function matchesKeyGroup (e: KeyboardEvent, group: string): boolean {
  const { modifiers, actualKey } = parseKeyGroup(group)

  const expectCtrl = modifiers.ctrl || (!isMac && (modifiers.cmd || modifiers.meta))
  const expectMeta = isMac && (modifiers.cmd || modifiers.meta)

  const modifiersMatch = (
    e.ctrlKey === expectCtrl &&
    e.metaKey === expectMeta &&
    e.shiftKey === modifiers.shift &&
    e.altKey === modifiers.alt
  )

  // If no actual key specified, only match modifiers
  if (actualKey === undefined) {
    return modifiersMatch
  }

  return modifiersMatch && e.key.toLowerCase() === actualKey.toLowerCase()
}

// Re-export utilities for advanced usage
export { keyAliasMap, normalizeKey } from './aliases'
export { MODIFIERS, splitKeyCombination, splitKeySequence } from './parsing'
