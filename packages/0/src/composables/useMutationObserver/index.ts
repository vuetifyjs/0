// Utilities
import { shallowRef, watch, onUnmounted, readonly } from 'vue'

// Composables
import { useHydration } from '#v0/composables/useHydration'

// Globals
import { SUPPORTS_MUTATION_OBSERVER } from '#v0/constants/globals'

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
  childList?: boolean
  attributes?: boolean
  characterData?: boolean
  subtree?: boolean
  attributeOldValue?: boolean
  characterDataOldValue?: boolean
  attributeFilter?: string[]
}

/**
 * Composable for observing DOM mutations
 *
 * @param target - Element ref to observe
 * @param callback - Callback fired on mutation
 * @param options - Observer options
 * @returns Observer controls
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */
export function useMutationObserver (
  target: Ref<Element | undefined>,
  callback: (entries: MutationObserverRecord[]) => void,
  options: UseMutationObserverOptions = {},
) {
  const { isHydrated } = useHydration()
  const observer = shallowRef<MutationObserver>()
  const isPaused = shallowRef(false)

  const observerOptions = {
    childList: options.childList ?? true,
    attributes: options.attributes ?? false,
    characterData: options.characterData ?? false,
    subtree: options.subtree ?? false,
    attributeOldValue: options.attributeOldValue ?? false,
    characterDataOldValue: options.characterDataOldValue ?? false,
    attributeFilter: options.attributeFilter,
  }

  watch([isHydrated, target], ([hydrated, el]) => {
    cleanup()

    if (!hydrated || !SUPPORTS_MUTATION_OBSERVER || !el) return

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
    })

    observer.value.observe(el, observerOptions)

    if (options.immediate) {
      // For immediate callback, we create a synthetic entry representing the initial state
      // Create empty NodeList-like objects for consistency
      const emptyNodeList = {
        length: 0,
        item: () => null,
        forEach: () => {},
        * [Symbol.iterator] () {},
      } as unknown as NodeList

      const syntheticEntry: MutationObserverRecord = {
        type: 'childList',
        target: el,
        addedNodes: emptyNodeList,
        removedNodes: emptyNodeList,
        previousSibling: null,
        nextSibling: null,
        attributeName: null,
        attributeNamespace: null,
        oldValue: null,
      }

      callback([syntheticEntry])
    }
  }, { immediate: true })

  function setup () {
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
    }
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
  }

  onUnmounted(stop)

  return {
    isPaused: readonly(isPaused),
    pause,
    resume,
    stop,
  }
}
