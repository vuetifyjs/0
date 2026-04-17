/**
 * @module ImageSwap
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Overlay layer that keeps the previously loaded source visible while a new
 * one loads, then fades out once the new image is ready. Pair with `Image.Img`
 * inside `Image.Root` — `Image.Img` renders the current image, `Image.Swap`
 * covers it with the prior image during a source change.
 *
 * Uses the Presence primitive internally to manage mount lifecycle. Sets
 * `context.hasPrevious` while active so `Image.Img` can pin its opacity
 * through the crossfade via `data-[has-previous]`.
 *
 * On its own, `Image.Swap` renders nothing — it only mounts during the
 * transient window between a src change and the next successful load.
 */

<script lang="ts">
  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Components
  import { Atom } from '#v0/components/Atom'
  import { Presence } from '#v0/components/Presence'

  // Composables
  import { useImageRoot } from './ImageRoot.vue'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ImageSwapProps extends AtomProps {
    /** Accessible alt text. Overlay is aria-hidden so this is typically cosmetic. */
    alt?: string
    /** Responsive image candidates. */
    srcset?: string
    /** Image sizes hint for responsive selection. */
    sizes?: string
    /** Intrinsic image width. */
    width?: number | string
    /** Intrinsic image height. */
    height?: number | string
    /** CORS request mode. */
    crossorigin?: '' | 'anonymous' | 'use-credentials'
    /** Referrer policy for the request. */
    referrerpolicy?:
      | 'origin'
      | 'no-referrer'
      | 'no-referrer-when-downgrade'
      | 'origin-when-cross-origin'
      | 'same-origin'
      | 'strict-origin'
      | 'strict-origin-when-cross-origin'
      | 'unsafe-url'
    /** How the browser should decode the image. */
    decoding?: 'sync' | 'async' | 'auto'
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImageSwapSlotProps {
    /** The source URL currently rendered by the overlay. */
    source: string | undefined
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImageSwap' })

  defineSlots<{
    default: (props: ImageSwapSlotProps) => any
  }>()

  const {
    as = 'img',
    renderless,
    alt,
    srcset,
    sizes,
    width,
    height,
    crossorigin,
    referrerpolicy,
    decoding = 'async',
    namespace = 'v0:image',
  } = defineProps<ImageSwapProps>()

  const context = useImageRoot(namespace)
  const previousSource = shallowRef<string | undefined>()

  watch(context.source, (newSource, oldSource) => {
    // Only capture the previous source when no transition is in flight —
    // navigating through several sources before any have loaded should
    // keep the original previous visible rather than flashing through
    // each intermediate URL. Skipping when newSource is falsy is
    // intentional: clearing src degrades to a hard swap since a cleared
    // src means the consumer has unmounted the logical image.
    if (oldSource && newSource && newSource !== oldSource && !context.hasPrevious.value) {
      previousSource.value = oldSource
      context.hasPrevious.value = true
    }
  })

  watch(context.isLoaded, loaded => {
    if (!loaded || !context.hasPrevious.value) return
    // Defer the leaving flip by one animation frame so the browser commits
    // the 'mounted' state before transitioning — cached srcs load fast
    // enough that Vue would otherwise batch mount + leave into one render.
    if (IN_BROWSER) {
      requestAnimationFrame(() => {
        context.hasPrevious.value = false
      })
    } else {
      context.hasPrevious.value = false
    }
  })

  function onTransitionEnd (_e: Event, done: () => void) {
    // Accept any transitionend; consumers may animate transform/filter/etc.
    // Requires at least one CSS transition on the element so the event fires.
    done()
    previousSource.value = undefined
  }

  const slotProps = toRef((): ImageSwapSlotProps => ({
    source: previousSource.value,
  }))
</script>

<template>
  <Presence
    v-slot="{ attrs: presenceAttrs, done }"
    v-model="context.hasPrevious.value"
    :immediate="false"
  >
    <Atom
      v-bind="presenceAttrs"
      :alt
      aria-hidden="true"
      :as
      :crossorigin
      :decoding
      :height
      :referrerpolicy
      :renderless
      role="img"
      :sizes
      :src="previousSource"
      :srcset
      :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%' }"
      :width
      @transitionend="onTransitionEnd($event, done)"
    >
      <slot v-bind="slotProps" />
    </Atom>
  </Presence>
</template>
