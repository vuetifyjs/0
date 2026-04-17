/**
 * @module ImageSwap
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Source-swapping image element. Keeps the previously loaded source visible
 * while a new one loads, then crossfades between them via opacity. Prevents
 * the placeholder flash that occurs with Image.Img when navigating between
 * already-loaded sources (carousels, galleries, next/previous UX).
 *
 * Uses the Presence primitive internally to manage the mount lifecycle of
 * the previous layer — data-state drives the exit transition. On the
 * initial load, behaves identically to Image.Img.
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
  import type { ImageStatus } from '#v0/composables/useImage'

  export interface ImageSwapProps extends AtomProps {
    /** Accessible alt text applied to both the current and previous image layers. */
    alt?: string
    /** Responsive image candidates. */
    srcset?: string
    /** Image sizes hint for responsive selection. */
    sizes?: string
    /** Intrinsic image width — set to prevent layout shift. */
    width?: number | string
    /** Intrinsic image height — set to prevent layout shift. */
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
    /** Native browser-managed lazy loading hint. */
    loading?: 'eager' | 'lazy'
    /** Resource priority hint. */
    fetchpriority?: 'high' | 'low' | 'auto'
    /** Class applied to both inner image elements (shared layout, object-fit, etc.). */
    imgClass?: string | string[] | Record<string, boolean>
    /** Class applied to the current image layer only. */
    currentClass?: string | string[] | Record<string, boolean>
    /** Class applied to the previous image layer only (during a swap). */
    previousClass?: string | string[] | Record<string, boolean>
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImageSwapEmits {
    load: [e: Event]
    error: [e: Event]
    loadstart: [src: string]
  }

  export interface ImageSwapSlotProps {
    /** Current loading status. */
    status: ImageStatus
    /** Whether the current source has loaded. */
    isLoaded: boolean
    /** Whether a previous source is currently mounted (a swap is in flight). */
    hasPrevious: boolean
    /** The active source URL (from Image.Root context). */
    currentSrc: string | undefined
    /** The last successfully loaded source, or undefined on first load. */
    previousSrc: string | undefined
    /** Attributes for the wrapper element. */
    attrs: {
      'data-state': ImageStatus
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImageSwap' })

  defineSlots<{
    default: (props: ImageSwapSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    alt,
    srcset,
    sizes,
    width,
    height,
    crossorigin,
    referrerpolicy,
    decoding = 'async',
    loading,
    fetchpriority,
    imgClass,
    currentClass,
    previousClass,
    namespace = 'v0:image',
  } = defineProps<ImageSwapProps>()

  const emit = defineEmits<ImageSwapEmits>()

  const context = useImageRoot(namespace)
  const currentSrc = toRef(() => context.source.value)
  const previousSrc = shallowRef<string | undefined>()
  const showPrevious = shallowRef(false)

  watch(currentSrc, (newSrc, oldSrc) => {
    // Only capture the previous source when no transition is in flight —
    // navigating through several sources before any have loaded should
    // keep the original previous visible rather than flashing through
    // each intermediate URL.
    if (oldSrc && newSrc && newSrc !== oldSrc && !showPrevious.value) {
      previousSrc.value = oldSrc
      showPrevious.value = true
    }
  })

  watch(context.status, (status, prev) => {
    if (status === 'loading' && prev !== 'loading' && context.source.value) {
      emit('loadstart', context.source.value)
    }
  }, { immediate: true })

  function onLoad (e: Event) {
    context.onLoad(e)
    emit('load', e)

    // Defer the leaving transition by one animation frame so the browser
    // commits the previous img's "mounted" opacity before flipping to
    // "leaving" — without this, cached images load fast enough that
    // Vue batches the show/hide flip into a single render and CSS never
    // sees an intermediate state to transition from.
    if (!showPrevious.value) return
    if (IN_BROWSER) {
      requestAnimationFrame(() => {
        showPrevious.value = false
      })
    } else {
      showPrevious.value = false
    }
  }

  function onError (e: Event) {
    context.onError(e)
    emit('error', e)
  }

  function onPresenceLeave (e: Event, done: () => void) {
    if ((e as TransitionEvent).propertyName === 'opacity') done()
  }

  const slotProps = toRef((): ImageSwapSlotProps => ({
    status: context.status.value,
    isLoaded: context.isLoaded.value,
    hasPrevious: showPrevious.value,
    currentSrc: currentSrc.value,
    previousSrc: previousSrc.value,
    attrs: {
      'data-state': context.status.value,
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    :style="{ position: 'relative' }"
    v-bind="slotProps.attrs"
  >
    <img
      :alt
      :class="[imgClass, currentClass]"
      :crossorigin
      :data-has-previous="showPrevious || undefined"
      :data-state="context.status.value"
      :decoding
      :fetchpriority
      :height
      :loading
      :referrerpolicy
      role="img"
      :sizes
      :src="currentSrc"
      :srcset
      :width
      @error="onError"
      @load="onLoad"
    >

    <Presence v-slot="{ attrs: presenceAttrs, done }" v-model="showPrevious" :immediate="false">
      <img
        v-bind="presenceAttrs"
        :alt
        aria-hidden="true"
        :class="[imgClass, previousClass]"
        :crossorigin
        :decoding
        :height
        :referrerpolicy
        role="img"
        :sizes
        :src="previousSrc"
        :srcset
        :style="{ position: 'absolute', inset: 0, width: '100%', height: '100%' }"
        :width
        @transitionend="onPresenceLeave($event, done)"
      >
    </Presence>

    <slot v-bind="slotProps" />
  </Atom>
</template>
