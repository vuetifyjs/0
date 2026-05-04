/**
 * @module ImageImg
 *
 * @see https://0.vuetifyjs.com/components/semantic/image
 *
 * @remarks
 * The image element. Reads the gated source and load/error handlers from the
 * Image context and binds them to the rendered element. Exposes `data-state`
 * so consumers can drive visibility via CSS.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useImageRoot } from './ImageRoot.vue'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ImageStatus } from '#v0/composables/useImage'

  export interface ImageImgProps extends AtomProps {
    /** Accessible alt text. */
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
    referrerpolicy?: string
    /** How the browser should decode the image. */
    decoding?: 'sync' | 'async' | 'auto'
    /** Native browser-managed lazy loading hint. */
    loading?: 'eager' | 'lazy'
    /** Resource priority hint. */
    fetchpriority?: 'high' | 'low' | 'auto'
    /** Namespace for retrieving the Image context. */
    namespace?: string
  }

  export interface ImageImgEmits {
    load: [e: Event]
    error: [e: Event]
    /**
     * Synthesized event fired when the image transitions into the `loading`
     * state: on initial mount if `eager`, on intersection if `lazy`, when
     * `src` changes, or when `retry()` is called. Emits the source URL that
     * started loading — analytics can treat every emit as one network request.
     */
    loadstart: [src: string]
  }

  export interface ImageImgSlotProps {
    /** Whether the image has loaded successfully. */
    isLoaded: boolean
    /** Current loading status. */
    status: ImageStatus
    /** Attributes to bind to the image element. */
    attrs: {
      'role': 'img'
      'src': string | undefined
      'srcset': string | undefined
      'sizes': string | undefined
      'alt': string | undefined
      'width': number | string | undefined
      'height': number | string | undefined
      'crossorigin': '' | 'anonymous' | 'use-credentials' | undefined
      'referrerpolicy': string | undefined
      'decoding': 'sync' | 'async' | 'auto'
      'loading': 'eager' | 'lazy' | undefined
      'fetchpriority': 'high' | 'low' | 'auto' | undefined
      'data-state': ImageStatus
      'onLoad': (e: Event) => void
      'onError': (e: Event) => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ImageImg' })

  defineSlots<{
    default: (props: ImageImgSlotProps) => any
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
    loading,
    fetchpriority,
    namespace = 'v0:image',
  } = defineProps<ImageImgProps>()

  const emit = defineEmits<ImageImgEmits>()

  const context = useImageRoot(namespace)

  function onLoad (e: Event) {
    context.onLoad(e)
    emit('load', e)
  }

  function onError (e: Event) {
    context.onError(e)
    emit('error', e)
  }

  watch(context.status, (status, prev) => {
    if (status === 'loading' && prev !== 'loading' && context.source.value) {
      emit('loadstart', context.source.value)
    }
  }, { immediate: true })

  const slotProps = toRef((): ImageImgSlotProps => ({
    isLoaded: context.isLoaded.value,
    status: context.status.value,
    attrs: {
      'role': 'img',
      'src': context.source.value,
      srcset,
      sizes,
      alt,
      width,
      height,
      crossorigin,
      referrerpolicy,
      decoding,
      loading,
      fetchpriority,
      'data-state': context.status.value,
      onLoad,
      onError,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
