// Utilities
import { onScopeDispose, watch, toValue, unref } from 'vue'
import { toArray } from '#v0/transformers'

// Types
import type { MaybeArray } from '#v0/types'
import type { MaybeRef, MaybeRefOrGetter } from 'vue'
export type CleanupFunction = () => void
export type EventHandler<E = Event> = (evt: E) => void

/**
 * Attaches event listeners to the window object with automatic cleanup.
 * This overload provides type-safe event handling for window-specific events
 * with proper event map typing and automatic listener removal on scope disposal.
 *
 * @param target Window object to attach listeners to.
 * @param event Event name(s) to listen for from WindowEventMap.
 * @param listener Event handler function(s) with proper window event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useEventListener<E extends keyof WindowEventMap> (
  target: Window,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches event listeners to the document object with automatic cleanup.
 * This overload provides type-safe event handling for document-specific events
 * with proper event map typing and automatic listener removal on scope disposal.
 *
 * @param target Document object to attach listeners to.
 * @param event Event name(s) to listen for from DocumentEventMap.
 * @param listener Event handler function(s) with proper document event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useEventListener<E extends keyof DocumentEventMap> (
  target: Document,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Document, ev: DocumentEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches event listeners to HTML elements with automatic cleanup.
 * This overload provides type-safe event handling for HTML element events
 * with reactive target support and automatic listener removal on scope disposal.
 *
 * @param target HTML element or reactive reference to element.
 * @param event Event name(s) to listen for from HTMLElementEventMap.
 * @param listener Event handler function(s) with proper HTML element event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useEventListener<E extends keyof HTMLElementEventMap> (
  target: MaybeRefOrGetter<HTMLElement | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: HTMLElement, ev: HTMLElementEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

/**
 * Attaches event listeners to any EventTarget with automatic cleanup.
 * This overload provides flexible event handling for any EventTarget implementation
 * with reactive target support and automatic listener removal on scope disposal.
 *
 * @param target EventTarget or reactive reference to target.
 * @param event Event name(s) to listen for as string identifiers.
 * @param listener Event handler function(s) with customizable event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useEventListener<EventType = Event> (
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRef<MaybeArray<EventHandler<EventType>>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction

export function useEventListener (
  target: MaybeRefOrGetter<EventTarget | null | undefined>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRef<MaybeArray<EventHandler>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  const cleanups: CleanupFunction[] = []

  const cleanup = () => {
    for (const fn of cleanups) {
      fn()
    }
    cleanups.length = 0
  }

  const register = (
    el: EventTarget,
    event: string,
    listener: EventHandler,
    options?: boolean | AddEventListenerOptions,
  ) => {
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

      for (const evt of eventList) {
        for (const listenerFn of listenerList) {
          cleanups.push(register(el, evt, listenerFn, opts))
        }
      }
    },
    { immediate: true, flush: 'post' },
  )

  const stop = () => {
    stopWatcher()
    cleanup()
  }

  onScopeDispose(stop, true)

  return stop
}

/**
 * Convenience function for attaching event listeners to the window object.
 * This function provides a simplified API by pre-binding the window target,
 * making it easier to handle window-specific events with automatic cleanup.
 *
 * @param event Event name(s) to listen for from WindowEventMap.
 * @param listener Event handler function(s) with proper window event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useWindowEventListener<E extends keyof WindowEventMap> (
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Window, ev: WindowEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  return useEventListener(window, event, listener, options)
}

/**
 * Convenience function for attaching event listeners to the document object.
 * This function provides a simplified API by pre-binding the document target,
 * making it easier to handle document-specific events with automatic cleanup.
 *
 * @param event Event name(s) to listen for from DocumentEventMap.
 * @param listener Event handler function(s) with proper document event typing.
 * @param options Optional event listener configuration.
 * @returns Function to manually remove all attached listeners.
 */
export function useDocumentEventListener<E extends keyof DocumentEventMap> (
  event: MaybeRefOrGetter<MaybeArray<E>>,
  listener: MaybeRef<MaybeArray<(this: Document, ev: DocumentEventMap[E]) => any>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>,
): CleanupFunction {
  return useEventListener(document, event, listener, options)
}
