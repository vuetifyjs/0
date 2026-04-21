/**
 * @module useImage
 *
 * @see https://0.vuetifyjs.com/composables/system/use-image
 *
 * @remarks
 * Image loading state machine with deferred loading support.
 *
 * Key features:
 * - State machine: idle → loading → loaded | error
 * - Reactive `eager` gate withholds the source until ready
 * - Automatic reset when `src` changes
 * - Manual `retry()` to re-attempt after error
 * - Bind-ready handlers and gated source
 * - SSR-safe
 *
 * Perfect for image components, lightboxes, lazy-loaded galleries,
 * and any UI that needs to react to image load state.
 *
 * @example
 * ```ts
 * import { useImage } from '@vuetify/v0'
 *
 * const { status, source, onLoad, onError } = useImage({
 *   src: 'https://example.com/img.png',
 * })
 * ```
 */

// Utilities
import { nextTick, onScopeDispose, shallowReadonly, shallowRef, toRef, toValue, watch } from 'vue'

// Types
import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

export type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error'

export interface UseImageOptions {
  /**
   * Image source URL. Changes trigger a reload.
   */
  src: MaybeRefOrGetter<string | undefined>
  /**
   * Whether the image should load. When `false`, status stays `idle` and
   * `source` resolves to `undefined` so the browser does not start loading.
   * @default true
   */
  eager?: MaybeRefOrGetter<boolean>
}

export interface UseImageReturn {
  /**
   * Current loading state.
   */
  readonly status: Readonly<ShallowRef<ImageStatus>>
  /**
   * Whether the image has not yet started loading (eager is false).
   */
  readonly isIdle: Readonly<Ref<boolean>>
  /**
   * Whether the image is currently loading.
   */
  readonly isLoading: Readonly<Ref<boolean>>
  /**
   * Whether the image has loaded successfully.
   */
  readonly isLoaded: Readonly<Ref<boolean>>
  /**
   * Whether the image failed to load.
   */
  readonly isError: Readonly<Ref<boolean>>
  /**
   * Gated source URL. Resolves to `undefined` while idle, otherwise the
   * current `src` value. Bind directly to the `<img>` `src` attribute.
   */
  readonly source: Readonly<Ref<string | undefined>>
  /**
   * Bind to the `<img>` `load` event.
   */
  onLoad: (e?: Event) => void
  /**
   * Bind to the `<img>` `error` event.
   */
  onError: (e?: Event) => void
  /**
   * Reset status back to `loading` so the browser re-attempts the source.
   */
  retry: () => void
}

/**
 * Tracks image loading state as a reactive state machine.
 *
 * @param options Configuration options
 * @returns Image context with state refs and event handlers
 *
 * @see https://0.vuetifyjs.com/composables/system/use-image
 *
 * @example
 * ```ts
 * import { toRef } from 'vue'
 * import { useImage } from '@vuetify/v0'
 *
 * const props = defineProps<{ src: string }>()
 *
 * const { source, isLoaded, onLoad, onError, retry } = useImage({
 *   src: toRef(() => props.src),
 * })
 * ```
 *
 * @example
 * Composed with `useIntersectionObserver` for lazy loading:
 * ```ts
 * const target = shallowRef<HTMLElement>()
 * const { isIntersecting } = useIntersectionObserver(target, () => {}, {
 *   once: true,
 *   rootMargin: '200px',
 * })
 *
 * const { source, onLoad, onError } = useImage({
 *   src: toRef(() => props.src),
 *   eager: isIntersecting,
 * })
 * ```
 */
export function useImage (options: UseImageOptions): UseImageReturn {
  const { src, eager = true } = options

  const status = shallowRef<ImageStatus>(toValue(eager) ? 'loading' : 'idle')

  const isIdle = toRef(() => status.value === 'idle')
  const isLoading = toRef(() => status.value === 'loading')
  const isLoaded = toRef(() => status.value === 'loaded')
  const isError = toRef(() => status.value === 'error')

  const source = toRef(() => status.value === 'idle' ? undefined : toValue(src))

  function onLoad () {
    status.value = 'loaded'
  }

  function onError () {
    status.value = 'error'
  }

  function retry () {
    // Cycle through 'idle' on the next tick so `source` briefly returns
    // undefined, forcing the <img> to clear its src attribute. Without
    // this, browsers skip the re-request when the new src equals the old
    // src — the retry would appear to "hang" in the loading state because
    // no load/error event ever fires for the same cached URL.
    const resumeAs = toValue(eager) ? 'loading' : 'idle'
    status.value = 'idle'
    nextTick(() => {
      status.value = resumeAs
    })
  }

  const stopEager = watch(
    () => toValue(eager),
    value => {
      if (value && status.value === 'idle') status.value = 'loading'
      else if (!value && status.value !== 'loaded' && status.value !== 'error') status.value = 'idle'
    },
  )

  const stopSrc = watch(
    () => toValue(src),
    () => {
      status.value = toValue(eager) ? 'loading' : 'idle'
    },
  )

  onScopeDispose(() => {
    stopEager()
    stopSrc()
  }, true)

  return {
    status: shallowReadonly(status),
    isIdle,
    isLoading,
    isLoaded,
    isError,
    source,
    onLoad,
    onError,
    retry,
  }
}
