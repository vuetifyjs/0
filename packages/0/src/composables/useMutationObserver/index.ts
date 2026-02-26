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
import { createObserver } from '#v0/composables/createObserver'

// Types
import type { ObserverReturn } from '#v0/composables/createObserver'
import type { MaybeRef } from 'vue'

export interface ObservableNodeList {
  readonly length: number
  item: (index: number) => Node | null
  forEach: (callback: (node: Node, index: number, list: ObservableNodeList) => void) => void
  [Symbol.iterator]: () => Iterator<Node>
}

export interface MutationObserverRecord {
  type: 'attributes' | 'childList' | 'characterData'
  target: Node
  addedNodes: ObservableNodeList
  removedNodes: ObservableNodeList
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

export interface UseMutationObserverReturn extends ObserverReturn {}

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
  target: MaybeRef<Element | null | undefined>,
  callback: (entries: MutationObserverRecord[]) => void,
  options: UseMutationObserverOptions = {},
): UseMutationObserverReturn {
  const observerOptions = {
    childList: options.childList ?? true,
    attributes: options.attributes ?? false,
    characterData: options.characterData ?? false,
    subtree: options.subtree ?? false,
    attributeOldValue: options.attributeOldValue ?? false,
    characterDataOldValue: options.characterDataOldValue ?? false,
    attributeFilter: options.attributeFilter,
  }

  return createObserver(target, callback, {
    supports: SUPPORTS_MUTATION_OBSERVER,
    once: options.once,
    create: cb => new MutationObserver(mutations => {
      cb(mutations.map(m => ({
        type: m.type,
        target: m.target,
        addedNodes: m.addedNodes,
        removedNodes: m.removedNodes,
        previousSibling: m.previousSibling,
        nextSibling: m.nextSibling,
        attributeName: m.attributeName,
        attributeNamespace: m.attributeNamespace,
        oldValue: m.oldValue,
      })))
    }),
    observe: (obs, el) => obs.observe(el, observerOptions),
    immediate: options.immediate
      ? el => {
        const emptyNodeList: ObservableNodeList = {
          length: 0,
          item: () => null,
          forEach: () => {},
          * [Symbol.iterator] () {},
        }

        return [{
          type: 'childList' as const,
          target: el,
          addedNodes: emptyNodeList,
          removedNodes: emptyNodeList,
          previousSibling: null,
          nextSibling: null,
          attributeName: null,
          attributeNamespace: null,
          oldValue: null,
        }]
      }
      : undefined,
    onceIncludesImmediate: true,
  })
}
