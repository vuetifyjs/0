/**
 * @module TourPrev
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Previous-step control. Disabled on the first step. Uses the PaginationItem
 * default-button host polyfill when `as` is not a native button.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface TourPrevProps extends AtomProps {
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
    /** Override disabled state */
    disabled?: boolean
  }

  export interface TourPrevSlotProps {
    isDisabled: boolean
    prev: () => void
    attrs: {
      'aria-label': string
      'aria-disabled': boolean | undefined
      'data-disabled': true | undefined
      'data-scope': 'tour'
      'data-part': 'prev'
      'disabled': boolean | undefined
      'tabindex': number
      'type': 'button' | undefined
      'role': 'button' | undefined
      'onClick': () => void
      'onKeydown': ((e: KeyboardEvent) => void) | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourPrev', inheritAttrs: false })

  defineSlots<{
    default: (props: TourPrevSlotProps) => any
  }>()

  const {
    as = 'button',
    renderless,
    namespace = 'v0:tour',
    disabled = false,
  } = defineProps<TourPrevProps>()

  const attrs = useAttrs()
  const locale = useLocale()
  const root = useTourRootContext(namespace)

  const isDisabled = toRef(() => disabled || !root.canGoBack.value)

  function prev () {
    if (isDisabled.value) return
    root.prev()
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      prev()
    }
  }

  const slotProps = toRef((): TourPrevSlotProps => ({
    isDisabled: isDisabled.value,
    prev,
    attrs: {
      'aria-label': locale.ti('Tour.prev') ?? 'Go to previous step',
      'aria-disabled': as === 'button' ? undefined : isDisabled.value,
      'data-disabled': isDisabled.value || undefined,
      'data-scope': 'tour',
      'data-part': 'prev',
      'disabled': as === 'button' ? isDisabled.value : undefined,
      'tabindex': isDisabled.value ? -1 : 0,
      'type': as === 'button' ? 'button' : undefined,
      'role': as === 'button' ? undefined : 'button',
      'onClick': prev,
      'onKeydown': as === 'button' ? undefined : onKeydown,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
