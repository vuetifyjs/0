/**
 * @module ImagePresence
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * Source-transitioning image element. Keeps the previously loaded source
 * visible while a new one loads, then crossfades between them via opacity.
 * Uses the Presence primitive to manage the mount lifecycle of the previous
 * layer — its data-state drives the exit transition.
 *
 * Replaces Image.Img when you want seamless transitions between already-
 * loaded sources (carousels, galleries, next/previous navigation). On the
 * initial load, behaves identically to Image.Img.
 *
 * API note: despite sharing the name, Image.Presence is not driven by a
 * v-model boolean like the top-level Presence primitive — its lifecycle is
 * triggered implicitly by src changes on Image.Root.
 */

<script lang="ts">
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

  export interface ImagePresenceProps extends AtomProps {
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
    /** Class applied to both inner image elements. */
    imgClass?: string | string[] | Record<string, boolean>
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImagePresenceEmits {
    load: [e: Event]
    error: [e: Event]
    loadstart: [src: string]
  }

  export interface ImagePresenceSlotProps {
    /** Current loading status. */
    status: ImageStatus
    /** Whether the current source has loaded. */
    isLoaded: boolean
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
  defineOptions({ name: 'ImagePresence' })

  defineSlots<{
    default: (props: ImagePresenceSlotProps) => any
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
    namespace = 'v0:image',
  } = defineProps<ImagePresenceProps>()

  const emit = defineEmits<ImagePresenceEmits>()

  const context = useImageRoot(namespace)
  const currentSrc = toRef(() => context.source.value)
  const previousSrc = shallowRef<string | undefined>()
  const showPrevious = shallowRef(false)

  watch(currentSrc, (newSrc, oldSrc) => {
    if (oldSrc && newSrc && newSrc !== oldSrc) {
      previousSrc.value = oldSrc
      showPrevious.value = true
    }
  })

  watch(context.isLoaded, loaded => {
    if (loaded && showPrevious.value) {
      showPrevious.value = false
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
  }

  function onError (e: Event) {
    context.onError(e)
    emit('error', e)
  }

  function onPresenceLeave (e: Event, done: () => void) {
    if ((e as TransitionEvent).propertyName === 'opacity') done()
  }

  const slotProps = toRef((): ImagePresenceSlotProps => ({
    status: context.status.value,
    isLoaded: context.isLoaded.value,
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
    class="relative"
    :renderless
    v-bind="slotProps.attrs"
  >
    <img
      :alt
      :class="[imgClass, 'transition-opacity opacity-0 data-[state=loaded]:opacity-100']"
      :crossorigin
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

    <Presence v-slot="{ attrs: presenceAttrs, done }" v-model="showPrevious">
      <img
        v-bind="presenceAttrs"
        :alt
        aria-hidden="true"
        :class="[imgClass, 'absolute inset-0 w-full h-full transition-opacity data-[state=leaving]:opacity-0']"
        :crossorigin
        :decoding
        :height
        :referrerpolicy
        role="img"
        :sizes
        :src="previousSrc"
        :srcset
        :width
        @transitionend="onPresenceLeave($event, done)"
      >
    </Presence>

    <slot v-bind="slotProps" />
  </Atom>
</template>
