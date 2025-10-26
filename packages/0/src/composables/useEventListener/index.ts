/**
 * @module useEventListener
 *
 * @remarks
 * Event listener composable with automatic cleanup on scope disposal.
 *
 * Key features:
 * - Supports Window, Document, and HTMLElement targets
 * - Reactive targets, events, and listeners
 * - Event options support (capture, passive, once)
 * - Automatic removeEventListener on unmount
 * - Multiple overloads for type safety
 *
 * Perfect for safely managing event listeners in Vue components.
 */

// Utilities
import { onScopeDispose, watch, toValue, unref } from 'vue'

// Transformers
import { toArray } from '#v0/composables'

// Types
import type { MaybeArray } from '#v0/types'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'
export type CleanupFunction = () => void
export type EventHandler<E = Event> = (event: E) => void

/**
 * Attaches an event listener to the window.
 *
 * @param target The window object.
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template E The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useEventListener<E extends keyof WindowEventMap> (
  target: Window,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Window, event: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches an event listener to the document.
 *
 * @param target The document object.
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template E The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useEventListener<E extends keyof DocumentEventMap> (
  target: Document,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Document, event: DocumentEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches an event listener to an HTML element.
 *
 * @param target The HTML element.
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template E The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useEventListener<E extends keyof HTMLElementEventMap> (
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: HTMLElement, event: HTMLElementEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches an event listener to an event target.
 *
 * @param target The event target.
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template EventType The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useEventListener<EventType = Event> (
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRef<MaybeArray<EventHandler<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches an event listener to a target.
 *
 * @param target The target to attach the event listener to.
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useEventListener (
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRef<MaybeArray<EventHandler>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  const cleanups: CleanupFunction[] = []

  function cleanup () {
    for (const fn of cleanups) {
      fn()
    }
    cleanups.length = 0
  }

  function register (
    el: EventTarget,
    event: string,
    listener: EventHandler,
    options?: boolean | AddEventListenerOptions,
  ) {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  const stopWatcher = watch(
    () => [toValue(target), toValue(event), unref(listener), toValue(options)] as const,
    ([el, events, listeners, opts]) => {
      cleanup()
      if (!el) return

      const eventList = toArray(events)
      const listenerList = toArray(listeners)

      for (const event of eventList) {
        for (const listenerFn of listenerList) {
          cleanups.push(register(el, event, listenerFn, opts))
        }
      }
    },
    { immediate: true, flush: 'post' },
  )

  function stop () {
    stopWatcher()
    cleanup()
  }

  onScopeDispose(stop, true)

  return stop
}

/**
 * Attaches an event listener to the window.
 *
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template E The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useWindowEventListener<E extends keyof WindowEventMap> (
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Window, event: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  return useEventListener(window, event, listener, options)
}

/**
 * Attaches an event listener to the document.
 *
 * @param event The event to listen for.
 * @param listener The event listener.
 * @param options The event listener options.
 * @template E The event type.
 * @returns A function to remove the event listener.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-event-listener
 */
export function useDocumentEventListener<E extends keyof DocumentEventMap> (
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Document, event: DocumentEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  return useEventListener(document, event, listener, options)
}
