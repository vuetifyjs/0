/**
 * @module useHotkey
 *
 * @remarks
 * Hotkey registry composable with key combination and sequence support.
 *
 * Built on top of useRegistry for collection management, event emission,
 * and context injection via the trinity pattern.
 *
 * Key features:
 * - Key combination support (`ctrl+k`, `shift+enter`)
 * - Key sequence support (`g-h` for GitHub-style shortcuts)
 * - Platform-aware modifiers (Mac: cmd→meta, others: cmd→ctrl)
 * - Input focus detection (skip when typing in inputs)
 * - Sequence timeout with automatic reset
 * - Key alias normalization
 * - Per-hotkey pause/resume/stop functionality
 * - Global pauseAll/resumeAll for entire registry
 * - Automatic cleanup on scope disposal
 * - SSR-safe (no-op when not in browser)
 */

// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useRegistry } from '#v0/composables/useRegistry'
import { useWindowEventListener } from '#v0/composables/useEventListener'

// Utilities
import { onScopeDispose, shallowRef, toRef } from 'vue'
import { genId } from '#v0/utilities'
import { splitKeyCombination, splitKeySequence, MODIFIERS } from './parsing'

// Constants
import { IN_BROWSER } from '#v0/constants/globals'

// Types
import type { RegistryContext, RegistryOptions, RegistryTicket } from '#v0/composables/useRegistry'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { ID } from '#v0/types'
import type { App, Ref } from 'vue'

export interface HotkeyTicket<V = unknown> extends RegistryTicket<V> {
  /**
   * The hotkey pattern string (e.g., 'ctrl+k', 'g-h')
   */
  pattern: string
  /**
   * Callback function invoked when the hotkey is triggered
   */
  callback: (e: KeyboardEvent) => void
  /**
   * The keyboard event type to listen for
   * @default 'keydown'
   */
  event: 'keydown' | 'keyup'
  /**
   * Whether to trigger when an input element is focused
   * @default false
   */
  inputs: boolean
  /**
   * Whether to prevent the default browser action
   * @default true
   */
  preventDefault: boolean
  /**
   * Timeout in ms before a key sequence resets
   * @default 1000
   */
  sequenceTimeout: number
  /**
   * Parsed sequence of key groups (internal)
   */
  keyGroups: string[]
  /**
   * Whether this is a multi-key sequence (internal)
   */
  isSequence: boolean
  /**
   * Current position in sequence (internal)
   */
  sequenceProgress: number
  /**
   * Sequence timeout timer (internal)
   */
  sequenceTimer?: ReturnType<typeof setTimeout>
  /**
   * Event listener cleanup function (internal)
   */
  cleanupRef: (() => void) | null
  /**
   * Whether this hotkey is currently paused
   */
  isPaused: boolean
  /**
   * Whether the hotkey listener is currently active
   */
  isActive: Readonly<Ref<boolean>>
  /**
   * Pause this hotkey (stops responding but preserves configuration)
   */
  pause: () => void
  /**
   * Resume this hotkey after pause
   */
  resume: () => void
  /**
   * Stop this hotkey and unregister it
   */
  stop: () => void
}

export interface HotkeyContext<Z extends HotkeyTicket = HotkeyTicket> extends Omit<RegistryContext<Z>, 'register'> {
  /**
   * Register a new hotkey
   *
   * @param ticket - Partial ticket with pattern and callback required
   * @returns The registered ticket with controls
   *
   * @example
   * ```ts
   * const hotkeys = createHotkey()
   *
   * const ticket = hotkeys.register({
   *   pattern: 'ctrl+k',
   *   callback: (e) => console.log('triggered'),
   * })
   *
   * // Use ticket controls
   * ticket.pause()
   * ticket.resume()
   * ticket.stop()
   * ```
   */
  register: (ticket: Partial<Z> & { pattern: string, callback: (e: KeyboardEvent) => void }) => Z
  /**
   * Unregister a hotkey by ID
   *
   * @param id - The ticket ID to unregister
   * @returns The unregistered ticket or undefined
   */
  unregister: (id: ID) => Z | undefined
  /**
   * Pause all hotkeys in the registry
   */
  pauseAll: () => void
  /**
   * Resume all hotkeys in the registry
   */
  resumeAll: () => void
  /**
   * Whether all hotkeys are globally paused
   */
  isGloballyPaused: Readonly<Ref<boolean>>
  /**
   * Dispose of the registry and clean up all hotkeys
   */
  dispose: () => void
}

export interface HotkeyOptions extends RegistryOptions {
  /**
   * Default keyboard event type for hotkeys
   * @default 'keydown'
   */
  event?: 'keydown' | 'keyup'
  /**
   * Default: whether to trigger when input is focused
   * @default false
   */
  inputs?: boolean
  /**
   * Default: whether to prevent default browser action
   * @default true
   */
  preventDefault?: boolean
  /**
   * Default sequence timeout in ms
   * @default 1000
   */
  sequenceTimeout?: number
}

export interface HotkeyContextOptions extends HotkeyOptions {
  namespace?: string
}

// Cache platform detection at module level
const isMac = IN_BROWSER && (navigator?.userAgent?.includes('Macintosh') ?? false)

/**
 * Creates a new hotkey registry instance
 *
 * @param options - Configuration options
 * @returns A hotkey registry with register/unregister/pauseAll/resumeAll methods
 *
 * @example
 * ```ts
 * import { createHotkey } from '@vuetify/v0'
 *
 * const hotkeys = createHotkey()
 *
 * // Register a hotkey
 * const ticket = hotkeys.register({
 *   pattern: 'ctrl+k',
 *   callback: (e) => console.log('Command palette'),
 * })
 *
 * // Register a sequence
 * hotkeys.register({
 *   pattern: 'g-h',
 *   callback: () => console.log('Go home'),
 * })
 *
 * // Control individual hotkeys
 * ticket.pause()
 * ticket.resume()
 * ticket.stop()
 *
 * // Control all hotkeys
 * hotkeys.pauseAll()
 * hotkeys.resumeAll()
 * ```
 */
export function createHotkey<
  Z extends HotkeyTicket = HotkeyTicket,
  E extends HotkeyContext<Z> = HotkeyContext<Z>,
> (_options: HotkeyOptions = {}): E {
  const {
    event: defaultEvent = 'keydown',
    inputs: defaultInputs = false,
    preventDefault: defaultPreventDefault = true,
    sequenceTimeout: defaultSequenceTimeout = 1000,
    ...options
  } = _options

  const registry = useRegistry<Z, RegistryContext<Z>>({ ...options, events: true })
  const isGloballyPaused = shallowRef(false)

  function isInputFocused (inputs: boolean): boolean {
    if (inputs) return false

    const activeElement = document.activeElement as HTMLElement | null
    if (!activeElement) return false

    return (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable ||
      activeElement.contentEditable === 'true'
    )
  }

  function resetSequence (ticket: Z) {
    ticket.sequenceProgress = 0
    if (ticket.sequenceTimer) {
      clearTimeout(ticket.sequenceTimer)
      ticket.sequenceTimer = undefined
    }
  }

  function matchesKeyGroup (e: KeyboardEvent, group: string): boolean {
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

  function createHandler (ticket: Z) {
    return function handler (e: KeyboardEvent) {
      debugger
      if (isGloballyPaused.value || ticket.isPaused) return

      const group = ticket.keyGroups[ticket.sequenceProgress]

      if (!group || isInputFocused(ticket.inputs)) return

      if (!matchesKeyGroup(e, group)) {
        if (ticket.isSequence) resetSequence(ticket)
        return
      }

      if (ticket.preventDefault) e.preventDefault()

      if (!ticket.isSequence) {
        ticket.callback(e)
        return
      }

      clearTimeout(ticket.sequenceTimer)
      ticket.sequenceProgress++

      if (ticket.sequenceProgress === ticket.keyGroups.length) {
        ticket.callback(e)
        resetSequence(ticket)
        return
      }

      ticket.sequenceTimer = setTimeout(() => resetSequence(ticket), ticket.sequenceTimeout)
    }
  }

  function setup (ticket: Z) {
    if (!IN_BROWSER || ticket.isPaused) return

    if (ticket.keyGroups.length === 0) return

    ticket.cleanupRef = useWindowEventListener(ticket.event, createHandler(ticket))
  }

  function teardown (ticket: Z) {
    if (ticket.cleanupRef) {
      ticket.cleanupRef()
      ticket.cleanupRef = null
    }
    resetSequence(ticket)
  }

  function register (registration: Partial<Z> & { pattern: string, callback: (e: KeyboardEvent) => void }): Z {
    const id = registration.id ?? genId()
    const pattern = registration.pattern.toLowerCase()
    const keyGroups = splitKeySequence(pattern)

    const isActiveRef = shallowRef(false)

    const ticket: Partial<Z> = {
      ...registration,
      id,
      pattern,
      event: registration.event ?? defaultEvent,
      inputs: registration.inputs ?? defaultInputs,
      preventDefault: registration.preventDefault ?? defaultPreventDefault,
      sequenceTimeout: registration.sequenceTimeout ?? defaultSequenceTimeout,
      keyGroups,
      isSequence: keyGroups.length > 1,
      sequenceProgress: 0,
      sequenceTimer: undefined,
      cleanupRef: null,
      isPaused: false,
      isActive: toRef(() => isActiveRef.value),
      pause: () => {
        const t = registry.get(id)
        if (t && !t.isPaused) {
          t.isPaused = true
          teardown(t)
          isActiveRef.value = false
        }
      },
      resume: () => {
        const t = registry.get(id)
        if (t && t.isPaused) {
          t.isPaused = false
          setup(t)
          isActiveRef.value = t.cleanupRef !== null
        }
      },
      stop: () => unregister(id),
    }

    const registered = registry.register(ticket as Partial<Z>)

    setup(registered)
    isActiveRef.value = registered.cleanupRef !== null

    return registered
  }

  function unregister (id: ID): Z | undefined {
    const ticket = registry.get(id)
    if (!ticket) return undefined

    teardown(ticket)
    registry.unregister(id)

    return ticket
  }

  function pauseAll () {
    isGloballyPaused.value = true
    for (const ticket of registry.values()) {
      teardown(ticket)
    }
  }

  function resumeAll () {
    isGloballyPaused.value = false
    for (const ticket of registry.values()) {
      if (!ticket.isPaused) {
        setup(ticket)
      }
    }
  }

  function clear () {
    for (const ticket of registry.values()) {
      teardown(ticket)
    }
    registry.clear()
  }

  function dispose () {
    clear()
    registry.dispose()
  }

  onScopeDispose(dispose, true)

  return {
    ...registry,
    register,
    unregister,
    pauseAll,
    resumeAll,
    isGloballyPaused: toRef(() => isGloballyPaused.value),
    clear,
    dispose,
    get size () {
      return registry.size
    },
  } as E
}

interface ParsedKeyGroup {
  modifiers: Record<string, boolean>
  actualKey: string | undefined
}

function parseKeyGroup (group: string): ParsedKeyGroup {
  const { keys: parts } = splitKeyCombination(group.toLowerCase())

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

/**
 * Creates a new hotkey context with trinity pattern.
 *
 * @param options - Configuration options including namespace
 * @returns A trinity tuple: [useHotkey, provideHotkey, defaultContext]
 *
 * @example
 * ```ts
 * import { createHotkeyContext } from '@vuetify/v0'
 *
 * export const [useHotkey, provideHotkey, context] = createHotkeyContext({
 *   namespace: 'my-app:hotkeys',
 * })
 * ```
 */
export function createHotkeyContext<
  Z extends HotkeyTicket = HotkeyTicket,
  E extends HotkeyContext<Z> = HotkeyContext<Z>,
> (_options: HotkeyContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:hotkey', ...options } = _options
  const [useHotkeyContext, _provideHotkeyContext] = createContext<E>(namespace)
  const context = createHotkey<Z, E>(options)

  function provideHotkeyContext (_context: E = context, app?: App): E {
    return _provideHotkeyContext(_context, app)
  }

  return createTrinity<E>(useHotkeyContext, provideHotkeyContext, context)
}

/**
 * Returns the current hotkey context from dependency injection.
 *
 * @param namespace - The namespace for the hotkey context. Defaults to 'v0:hotkey'.
 * @returns The current hotkey context
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useHotkey } from '@vuetify/v0'
 *
 *   const hotkeys = useHotkey()
 *
 *   hotkeys.register({
 *     pattern: 'ctrl+s',
 *     callback: () => save(),
 *   })
 * </script>
 * ```
 */
export function useHotkey<
  Z extends HotkeyTicket = HotkeyTicket,
  E extends HotkeyContext<Z> = HotkeyContext<Z>,
> (namespace = 'v0:hotkey'): E {
  return useContext<E>(namespace)
}

// Re-export utilities for advanced usage
export { keyAliasMap, normalizeKey } from './aliases'
export { MODIFIERS, splitKeyCombination, splitKeySequence } from './parsing'
