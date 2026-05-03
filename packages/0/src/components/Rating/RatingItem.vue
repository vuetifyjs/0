/**
 * @module RatingItem
 *
 * @see https://0.vuetifyjs.com/components/forms/rating
 *
 * @remarks
 * Individual rating item (star). Consumes Rating context,
 * computes its visual state from the current or hovered value,
 * and emits pointer events for hover and click interaction.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useRatingRoot } from './RatingRoot.vue'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RatingItemState } from '#v0/composables/createRating'

  export interface RatingItemProps extends AtomProps {
    /** 1-based position */
    index: number
    /** Namespace for context injection from parent Rating.Root */
    namespace?: string
  }

  export interface RatingItemSlotProps {
    /** Fill state based on current or hovered value */
    state: RatingItemState
    /** Whether item is within hover preview range */
    isHighlighted: boolean
    /** Whether rating is disabled */
    isDisabled: boolean
    /** Whether rating is readonly */
    isReadonly: boolean
    /** Pre-computed attributes for binding */
    attrs: {
      'data-state': RatingItemState
      'data-highlighted': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'onPointermove': (e: PointerEvent) => void
      'onClick': () => void
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'RatingItem', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: RatingItemSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    index,
    namespace = 'v0:rating:root',
  } = defineProps<RatingItemProps>()

  const root = useRatingRoot(namespace)

  // Display value: hovered value takes precedence during hover
  const displayValue = toRef(() => {
    const hovered = root.hoveredValue.value
    if (root.isHovering.value && !isNull(hovered)) return hovered
    return root.value.value
  })

  function getState (): RatingItemState {
    const current = displayValue.value
    if (index <= Math.floor(current)) return 'full'
    if (index === Math.ceil(current) && current !== Math.floor(current)) return 'half'
    return 'empty'
  }

  const state = toRef(getState)
  const isHighlighted = toRef(() => index <= displayValue.value)

  function onPointermove (e: PointerEvent) {
    if (root.isDisabled.value || root.isReadonly.value) return

    if (root.half) {
      // Left half = index - 0.5, right half = index
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const mid = rect.left + rect.width / 2
      root.hoveredValue.value = e.clientX < mid ? index - 0.5 : index
    } else {
      root.hoveredValue.value = index
    }
  }

  function onClick () {
    if (root.isDisabled.value || root.isReadonly.value) return
    root.select(root.hoveredValue.value ?? index)
  }

  const slotProps = toRef((): RatingItemSlotProps => ({
    state: state.value,
    isHighlighted: isHighlighted.value,
    isDisabled: root.isDisabled.value,
    isReadonly: root.isReadonly.value,
    attrs: {
      'data-state': state.value,
      'data-highlighted': isHighlighted.value ? true : undefined,
      'data-disabled': root.isDisabled.value ? true : undefined,
      'data-readonly': root.isReadonly.value ? true : undefined,
      'onPointermove': onPointermove,
      'onClick': onClick,
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
