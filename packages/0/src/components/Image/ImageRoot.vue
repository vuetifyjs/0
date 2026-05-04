/**
 * @module ImageRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Root component for the Image compound. Owns the image loading state machine
 * via useImage and optionally drives lazy loading via useIntersectionObserver.
 * Provides context to Image.Img, Image.Placeholder, and Image.Fallback.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { useImage } from '#v0/composables/useImage'
  import { useIntersectionObserver } from '#v0/composables/useIntersectionObserver'
  import { useLogger } from '#v0/composables/useLogger'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ImageStatus, UseImageReturn } from '#v0/composables/useImage'

  export interface ImageRootProps extends AtomProps {
    /** Image source URL. Forwarded to Image.Img via context. */
    src?: string
    /** Defer loading until the root element intersects the viewport. */
    lazy?: boolean
    /** IntersectionObserver root margin. Only used when lazy is true. */
    rootMargin?: string
    /**
     * IntersectionObserver threshold(s). A number or array of numbers
     * between 0.0 and 1.0 indicating the percentage of the target's
     * visibility required to trigger the observer. Only used when lazy is true.
     */
    threshold?: number | number[]
    /**
     * IntersectionObserver root element. If omitted, the viewport is used.
     * Pass a scroll container to observe intersections relative to it instead.
     * Only used when lazy is true.
     */
    root?: Element | null
    /** Namespace for dependency injection. */
    namespace?: string
  }

  export interface ImageRootSlotProps {
    /** Current loading status. */
    status: ImageStatus
    isIdle: boolean
    isLoading: boolean
    isLoaded: boolean
    isError: boolean
    /** Reset the image and re-attempt loading. */
    retry: () => void
    /** Attributes for the root element. */
    attrs: {
      'data-state': ImageStatus
    }
  }

  export interface ImageContext extends UseImageReturn {}

  export const [useImageRoot, provideImageRoot] = createContext<ImageContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImageRoot' })

  defineSlots<{
    default: (props: ImageRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    src,
    lazy = false,
    rootMargin = '0px',
    threshold = 0,
    root = null,
    namespace = 'v0:image',
  } = defineProps<ImageRootProps>()

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const rootEl = toRef(() => toElement(atomRef.value?.element) as HTMLElement | null ?? null)

  if (lazy && renderless) {
    const logger = useLogger()
    logger.warn('[v0:image] `lazy` requires a wrapper element but `renderless` is set — the image will never load. Remove `renderless` or use useIntersectionObserver manually.')
  }

  const { isIntersecting } = lazy
    ? useIntersectionObserver(rootEl, () => {}, { once: true, rootMargin, threshold, root })
    : { isIntersecting: shallowRef(true) }

  const image = useImage({
    src: toRef(() => src),
    eager: isIntersecting,
  })

  provideImageRoot(namespace, image)

  const slotProps = toRef((): ImageRootSlotProps => ({
    status: image.status.value,
    isIdle: image.isIdle.value,
    isLoading: image.isLoading.value,
    isLoaded: image.isLoaded.value,
    isError: image.isError.value,
    retry: image.retry,
    attrs: {
      'data-state': image.status.value,
    },
  }))
</script>

<template>
  <Atom
    ref="atom"
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
