/**
 * @module LazyRoot
 *
 * @remarks
 * Root component for deferred content rendering. Uses IntersectionObserver
 * to detect when the element enters the viewport and switches from
 * placeholder to content. Leverages the useLazy composable for SSR-safe
 * booted state management.
 *
 * Supports integration with Vue Transition via the `onAfterLeave` slot prop,
 * which resets the booted state when the leave transition completes (unless
 * eager mode is enabled).
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { LazyContext } from '#v0/composables/useLazy'

  export interface LazyRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** When true, content renders immediately without waiting for intersection */
    eager?: boolean
    /** IntersectionObserver root margin */
    rootMargin?: string
    /** IntersectionObserver threshold */
    threshold?: number | number[]
  }

  export interface LazyRootSlotProps {
    /** Whether the lazy content has been activated (intersected or eager) */
    isBooted: boolean
    /** Whether content is ready to be displayed */
    hasContent: boolean
    /** Reset booted state. Call on leave transition if not eager. */
    reset: () => void
    /** Transition callback for after-leave. Resets if not eager. */
    onAfterLeave: () => void
  }

  export type LazyRootContext = LazyContext

  export const [useLazyRoot, provideLazyRoot] = createContext<LazyRootContext>()
</script>

<script lang="ts" setup>
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useIntersectionObserver } from '#v0/composables/useIntersectionObserver'
  import { useLazy } from '#v0/composables/useLazy'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  defineOptions({ name: 'LazyRoot' })

  defineSlots<{
    default: (props: LazyRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:lazy',
    eager = false,
    rootMargin = '0px',
    threshold = 0,
  } = defineProps<LazyRootProps>()

  const rootEl = shallowRef<HTMLElement>()
  const isIntersected = shallowRef(false)

  // Use useLazy with intersection as the active signal
  const context = useLazy(isIntersected, { eager })

  useIntersectionObserver(
    rootEl,
    entries => {
      const entry = entries.at(-1)
      if (entry?.isIntersecting) {
        isIntersected.value = true
      }
    },
    { once: true, rootMargin, threshold },
  )

  provideLazyRoot(namespace, context)

  const slotProps = toRef((): LazyRootSlotProps => ({
    isBooted: context.isBooted.value,
    hasContent: context.hasContent.value,
    reset: context.reset,
    onAfterLeave: context.onAfterLeave,
  }))
</script>

<template>
  <Atom ref="rootEl" :as :renderless>
    <slot v-bind="slotProps" />
  </Atom>
</template>
