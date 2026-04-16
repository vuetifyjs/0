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

  // Utilities
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { ImageStatus, UseImageReturn } from '#v0/composables/useImage'
  import type { Ref } from 'vue'

  export interface ImageRootProps extends AtomProps {
    /** Image source URL. Forwarded to Image.Img via context. */
    src?: string
    /** Defer loading until the root element intersects the viewport. */
    lazy?: boolean
    /** IntersectionObserver root margin. Only used when lazy is true. */
    rootMargin?: string
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

  export interface ImageContext extends UseImageReturn {
    /** Resolved root element ref — used by IntersectionObserver. */
    rootEl: Ref<HTMLElement | null>
  }

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
    namespace = 'v0:image',
  } = defineProps<ImageRootProps>()

  const atomRef = useTemplateRef<AtomExpose>('atom')
  const rootEl = toRef(() => toElement(atomRef.value?.element) as HTMLElement | null ?? null)

  const { isIntersecting } = lazy
    ? useIntersectionObserver(rootEl, () => {}, { once: true, rootMargin })
    : { isIntersecting: shallowRef(true) }

  const image = useImage({
    src: toRef(() => src),
    eager: isIntersecting,
  })

  provideImageRoot(namespace, { ...image, rootEl })

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
