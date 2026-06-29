import { useImage } from '@vuetify/v0'
import { shallowRef, toRef, toValue, watch } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

/**
 * Wraps `useImage` with placeholder + fallback handling. The primary `src`
 * drives the load state machine; if it errors and a `fallback` is provided,
 * the active source swaps to the fallback and the machine re-runs against it.
 * `reload()` rewinds to the primary source so the full lifecycle replays.
 */
export function useImageCard (
  src: MaybeRefOrGetter<string | undefined>,
  fallback?: MaybeRefOrGetter<string | undefined>,
) {
  const active = shallowRef(toValue(src))

  watch(() => toValue(src), value => {
    active.value = value
  })

  const image = useImage({ src: active })

  const isFallback = toRef(() => !!toValue(fallback) && active.value === toValue(fallback))

  function onError (e?: Event) {
    const fb = toValue(fallback)

    if (fb && active.value !== fb) {
      active.value = fb
      return
    }

    image.onError(e)
  }

  function reload () {
    const primary = toValue(src)

    if (active.value === primary) {
      image.retry()
    } else {
      active.value = primary
    }
  }

  return { ...image, onError, isFallback, reload }
}
