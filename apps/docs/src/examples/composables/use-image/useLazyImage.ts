import { useImage, useIntersectionObserver } from '@vuetify/v0'
import { shallowRef, toValue } from 'vue'

import type { MaybeRefOrGetter } from 'vue'

/**
 * Combines `useImage` and `useIntersectionObserver` into a single reusable
 * composable. The image source is gated by viewport intersection, and the
 * returned `target` ref is bound to the element that should be observed.
 */
export function useLazyImage (src: MaybeRefOrGetter<string | undefined>, rootMargin = '0px') {
  const target = shallowRef<HTMLElement>()

  const { isIntersecting } = useIntersectionObserver(target, () => {}, {
    once: true,
    rootMargin,
  })

  const image = useImage({
    src: () => toValue(src),
    eager: isIntersecting,
  })

  return { target, ...image }
}
