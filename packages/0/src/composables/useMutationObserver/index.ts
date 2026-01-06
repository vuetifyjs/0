/**
 * @module useMutationObserver
 *
 * @remarks
 * MutationObserver composable with lifecycle management.
 *
 * Key features:
 * - MutationObserver API wrapper
 * - Pause/resume/stop functionality
 * - Automatic cleanup on unmount
 * - SSR-safe (checks SUPPORTS_MUTATION_OBSERVER)
 * - Hydration-aware
 * - Configurable observation options (childList, attributes, characterData, etc.)
 *
 * Perfect for detecting DOM changes and responding to mutations.
 */

// Globals
import { SUPPORTS_MUTATION_OBSERVER } from '#v0/constants/globals'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Utilities
import { isNull } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toRef, watch } from 'vue'

// Types
import type { Ref } from 'vue'

export interface MutationObserverRecord {
  type: 'attributes' | 'childList' | 'characterData'
  target: Node
  addedNodes: NodeList
  removedNodes: NodeList
  previousSibling: Node | null
  nextSibling: Node | null
  attributeName: string | null
  attributeNamespace: string | null
  oldValue: string | null
}

export interface UseMutationObserverOptions {
  immediate?: boolean
  once?: boolean
  childList?: boolean
  attributes?: boolean
  characterData?: boolean
  subtree?: boolean
  attributeOldValue?: boolean
  characterDataOldValue?: boolean
  attributeFilter?: string[]
}

export interface UseMutationObserverReturn {
  /**
   * Whether the observer is currently active (created and observing)
   */
  readonly isActive: Readonly<Ref<boolean>>

  /**
   * Whether the observer is currently paused
   */
  readonly isPaused: Readonly<Ref<boolean>>

  /**
   * Pause observation (disconnects observer but keeps it alive)
   */
  pause: () => void

  /**
   * Resume observation
   */
  resume: () => void

  /**
   * Stop observation and clean up (destroys observer)
   */
  stop: () => void
}

/**
 * A composable that uses the Mutation Observer API to detect changes in the DOM.
 *
 * @param target The element to observe.
 * @param callback The callback to execute when a mutation is observed.
 * @param options The options for the Mutation Observer.
 * @returns An object with methods to control the observer.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 * @see https://0.vuetifyjs.com/composables/system/use-mutation-observer
 *
 * @example
 * ```ts
 * import { ref } from 'vue'
 * import { useMutationObserver } from '@vuetify/v0'
 *
 * const container = ref<HTMLElement>()
 *
 * const { pause, resume, isPaused } = useMutationObserver(
 *   container,
 *   (mutations) => {
 *     mutations.forEach((mutation) => {
 *       if (mutation.type === 'childList') {
 *         console.log('Children changed:', mutation.addedNodes, mutation.removedNodes)
 *       } else if (mutation.type === 'attributes') {
 *         console.log('Attribute changed:', mutation.attributeName)
 *       }
 *     })
 *   },
 *   {
 *     childList: true,
 *     attributes: true,
 *     subtree: true
 *   }
 * )
 *
 * // Pause observation
 * pause()
 *
 * // Resume observation
 * resume()
 * ```
 */
export function useMutationObserver (
  target: Ref<Element | undefined>,
  callback: (entries: MutationObserverRecord[]) => void,
  options: UseMutationObserverOptions = {},
): UseMutationObserverReturn {
  const { isHydrated } = useHydration()
  const observer = shallowRef<MutationObserver | null>()
  const isPaused = shallowRef(false)
  const isActive = toRef(() => !!observer.value)

  const observerOptions = {
    childList: options.childList ?? true,
    attributes: options.attributes ?? false,
    characterData: options.characterData ?? false,
    subtree: options.subtree ?? false,
    attributeOldValue: options.attributeOldValue ?? false,
    characterDataOldValue: options.characterDataOldValue ?? false,
    attributeFilter: options.attributeFilter,
  }

  function setup () {
    // null = permanently stopped, undefined = not yet created
    if (isNull(observer.value)) return
    if (!isHydrated.value || !SUPPORTS_MUTATION_OBSERVER || !target.value || isPaused.value) return

    observer.value = new MutationObserver(mutations => {
      const transformedEntries: MutationObserverRecord[] = mutations.map(mutation => ({
        type: mutation.type,
        target: mutation.target,
        addedNodes: mutation.addedNodes,
        removedNodes: mutation.removedNodes,
        previousSibling: mutation.previousSibling,
        nextSibling: mutation.nextSibling,
        attributeName: mutation.attributeName,
        attributeNamespace: mutation.attributeNamespace,
        oldValue: mutation.oldValue,
      }))

      callback(transformedEntries)

      if (options.once) {
        stop()
      }
    })

    observer.value.observe(target.value, observerOptions)

    if (options.immediate) {
      const emptyNodeList = {
        length: 0,
        item: () => null,
        forEach: () => {},
        * [Symbol.iterator] () {},
      } as unknown as NodeList

      const syntheticEntry: MutationObserverRecord = {
        type: 'childList',
        target: target.value,
        addedNodes: emptyNodeList,
        removedNodes: emptyNodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      }

      callback([syntheticEntry])

      if (options.once) {
        stop()
      }
    }
  }

  // Watch target changes - only cleanup/setup when element actually changes
  watch(
    () => target.value,
    (el, oldEl) => {
      // Only cleanup if we had a previous element
      if (oldEl) cleanup()

      if (isHydrated.value && el) {
        setup()
      }
    },
    { immediate: true },
  )

  // Handle initial hydration - setup once when hydrated if target exists
  if (!isHydrated.value) {
    const stopHydrationWatch = watch(
      () => isHydrated.value,
      hydrated => {
        if (hydrated && target.value && !observer.value) {
          setup()
          stopHydrationWatch()
        }
      },
    )
  }

  function cleanup () {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = undefined
    }
  }

  function pause () {
    isPaused.value = true
    observer.value?.disconnect()
  }

  function resume () {
    isPaused.value = false
    setup()
  }

  function stop () {
    cleanup()
    observer.value = null
  }

  onScopeDispose(stop, true)

  return {
    isActive: shallowReadonly(isActive),
    isPaused: shallowReadonly(isPaused),
    pause,
    resume,
    stop,
  }
}
