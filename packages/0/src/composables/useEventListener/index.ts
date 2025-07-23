// Utilities
import { onScopeDispose, watch, toValue } from 'vue'
import { IN_BROWSER } from '#v0/constants/globals'

type MaybeArray<T> = T | T[]

// Types
import type { MaybeRefOrGetter } from 'vue'

export type EventTarget = Window | Document | HTMLElement | ShadowRoot | null | undefined

/**
 *
 * @param target - The target element to attach the event listener to
 * @param event - The event name
 * @param listener - The event listener function
 * @param options - Event listener options
 * @returns Object with methods to manually start and stop listening for events
 */
export function useEventListener (
  target: MaybeRefOrGetter<EventTarget>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRefOrGetter<MaybeArray<EventListener>>,
  options?: MaybeRefOrGetter<boolean | AddEventListenerOptions>
): () => void

export function useEventListener (
  target: MaybeRefOrGetter<EventTarget>,
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRefOrGetter<MaybeArray<EventListener>>,
  options: MaybeRefOrGetter<boolean | AddEventListenerOptions> = false,
) {
  const cleanups: (() => void)[] = []

  const stopWatch = watch(
    () => toValue(target),
    el => {
      cleanup()
      if (!el) return

      const eventValue = toValue(event)
      const listenerValue = toValue(listener)
      const optionsValue = toValue(options)

      const events = (Array.isArray(eventValue) ? eventValue : [eventValue]) as string[]
      const listeners = (Array.isArray(listenerValue) ? listenerValue : [listenerValue]) as EventListener[]
      const opts = typeof optionsValue === 'boolean' ? { passive: optionsValue as boolean } : optionsValue

      for (const [eventIndex, eventName] of events.entries()) {
        const handler = listeners[eventIndex % listeners.length]

        el.addEventListener(eventName, handler, opts)
        cleanups.push(() => el.removeEventListener(eventName, handler, opts))
      }
    },
    { immediate: true, flush: 'post' },
  )

  const cleanup = () => {
    for (const fn of cleanups) fn()
    cleanups.length = 0
  }

  const stop = () => {
    stopWatch()
    cleanup()
  }

  onScopeDispose(stop)

  return stop
}

export function useWindowEventListener (
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRefOrGetter<MaybeArray<EventListener>>,
  options: MaybeRefOrGetter<boolean | AddEventListenerOptions> = false,
) {
  return useEventListener(() => IN_BROWSER ? window : null, event, listener, options)
}

export function useDocumentEventListener (
  event: MaybeRefOrGetter<MaybeArray<string>>,
  listener: MaybeRefOrGetter<MaybeArray<EventListener>>,
  options: MaybeRefOrGetter<boolean | AddEventListenerOptions> = false,
) {
  return useEventListener(() => IN_BROWSER ? document : null, event, listener, options)
}
