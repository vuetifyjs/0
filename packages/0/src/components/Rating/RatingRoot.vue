/**
 * @module RatingRoot
 *
 * @see https://0.vuetifyjs.com/components/forms/rating
 *
 * @remarks
 * Root component for ratings. Creates rating context, provides it to
 * child components (Item, HiddenInput), bridges v-model, and handles
 * hover tracking, keyboard navigation, and ARIA attributes.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import RatingHiddenInput from './RatingHiddenInput.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createRating } from '#v0/composables/createRating'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, shallowRef, toRef, toValue, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { RatingContext, RatingItemDescriptor } from '#v0/composables/createRating'
  import type { MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

  export interface RatingRootContext extends RatingContext {
    /** Form field name */
    readonly name?: string
    /** Hovered value (UI concern) */
    hoveredValue: ShallowRef<number | null>
    /** Whether user is hovering */
    isHovering: Readonly<Ref<boolean>>
    /** Whether interaction is disabled */
    isDisabled: Readonly<Ref<boolean>>
    /** Whether rating is readonly */
    isReadonly: Readonly<Ref<boolean>>
  }

  export interface RatingRootProps extends AtomProps {
    /** Current rating */
    modelValue?: number
    /** Total items (default: 5) */
    size?: number
    /** Enable 0.5 increments */
    half?: boolean
    /** Disable interaction */
    disabled?: MaybeRefOrGetter<boolean>
    /** Show value, prevent changes */
    readonly?: MaybeRefOrGetter<boolean>
    /** Form field name — triggers hidden input */
    name?: string
    /** Namespace for context provision */
    namespace?: string
  }

  export interface RatingRootSlotProps {
    /** Current rating value */
    value: number
    /** Array of rating items */
    items: RatingItemDescriptor[]
    /** Whether user is hovering */
    isHovering: boolean
    /** Whether rating is disabled */
    isDisabled: boolean
    /** Whether rating is readonly */
    isReadonly: boolean
    /** Pre-computed attributes for binding */
    attrs: {
      'role': 'slider'
      'tabindex': 0 | -1
      'aria-valuenow': number
      'aria-valuemin': 0
      'aria-valuemax': number
      'aria-valuetext': string
      'aria-disabled': true | undefined
      'aria-readonly': true | undefined
      'data-disabled': true | undefined
      'data-readonly': true | undefined
      'data-hovering': true | undefined
      'onKeydown': (e: KeyboardEvent) => void
      'onPointerleave': () => void
    }
  }

  export const [useRatingRoot, provideRatingRoot] = createContext<RatingRootContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'RatingRoot', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: RatingRootSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    size = 5,
    half = false,
    disabled = false,
    readonly: _readonly = false,
    name,
    namespace = 'v0:rating:root',
  } = defineProps<RatingRootProps>()

  const model = defineModel<number>({ default: 0 })

  const rating = createRating({
    value: model,
    size,
    half,
  })

  // Hover tracking — UI concern, not in composable
  const hoveredValue = shallowRef<number | null>(null)
  const isHovering = toRef(() => !isNull(hoveredValue.value))
  const isDisabled = toRef(() => toValue(disabled))
  const isReadonly = toRef(() => toValue(_readonly))

  // The display value is hovered value during hover, actual value otherwise
  const displayValue = toRef(() =>
    isHovering.value && !isNull(hoveredValue.value)
      ? hoveredValue.value
      : rating.value.value,
  )

  function onKeydown (e: KeyboardEvent) {
    if (isDisabled.value || isReadonly.value) return

    const actions: Record<string, () => void> = {
      ArrowRight: () => rating.next(),
      ArrowUp: () => rating.next(),
      ArrowLeft: () => rating.prev(),
      ArrowDown: () => rating.prev(),
      Home: () => rating.first(),
      End: () => rating.last(),
    }

    const action = actions[e.key]
    if (!action) return

    e.preventDefault()
    action()
  }

  function onPointerleave () {
    hoveredValue.value = null
  }

  const context: RatingRootContext = {
    ...rating,
    name,
    hoveredValue,
    isHovering,
    isDisabled,
    isReadonly,
  }

  const locale = useLocale()

  provideRatingRoot(namespace, context)

  const slotProps = toRef((): RatingRootSlotProps => ({
    value: displayValue.value,
    items: rating.items.value,
    isHovering: isHovering.value,
    isDisabled: isDisabled.value,
    isReadonly: isReadonly.value,
    attrs: {
      'role': 'slider',
      'tabindex': isDisabled.value ? -1 : 0,
      'aria-valuenow': rating.value.value,
      'aria-valuemin': 0,
      'aria-valuemax': rating.size,
      'aria-valuetext': locale.t('Rating.valueText', { value: rating.value.value, size: rating.size }),
      'aria-disabled': isDisabled.value ? true : undefined,
      'aria-readonly': isReadonly.value ? true : undefined,
      'data-disabled': isDisabled.value ? true : undefined,
      'data-readonly': isReadonly.value ? true : undefined,
      'data-hovering': isHovering.value ? true : undefined,
      'onKeydown': onKeydown,
      'onPointerleave': onPointerleave,
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

  <RatingHiddenInput v-if="name" />
</template>
