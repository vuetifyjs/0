// Composables
import { createRating } from '@vuetify/v0'

// Utilities
import { shallowRef, toRef } from 'vue'

// Types
import type { RatingItemDescriptor } from '@vuetify/v0'
import type { Ref, ShallowRef, WritableComputedRef } from 'vue'

const LABELS = ['Rate this product', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

export interface StarRating {
  value: WritableComputedRef<number>
  isFirst: Readonly<Ref<boolean>>
  isLast: Readonly<Ref<boolean>>
  display: Readonly<Ref<RatingItemDescriptor[]>>
  label: Readonly<Ref<string>>
  submitted: ShallowRef<number | null>
  select: (value: number) => void
  next: () => void
  prev: () => void
  setHover: (value: number) => void
  clearHover: () => void
  submit: () => void
  reset: () => void
}

export function useStarRating (): StarRating {
  const rating = createRating({ size: 5, half: true })
  const hover = shallowRef(0)
  const preview = createRating({ size: 5, half: true, value: hover })

  const submitted = shallowRef<number | null>(null)

  // Both renderings come straight from createRating items — no hand-rolled state.
  const display = toRef(() => hover.value > 0 ? preview.items.value : rating.items.value)
  const score = toRef(() => hover.value || rating.value.value)
  const label = toRef(() => LABELS[Math.ceil(score.value)] ?? LABELS[0])

  function setHover (value: number) {
    hover.value = value
  }

  function clearHover () {
    hover.value = 0
  }

  function submit () {
    submitted.value = rating.value.value
  }

  function reset () {
    rating.first()
    submitted.value = null
    hover.value = 0
  }

  return {
    value: rating.value,
    isFirst: rating.isFirst,
    isLast: rating.isLast,
    display,
    label,
    submitted,
    select: rating.select,
    next: rating.next,
    prev: rating.prev,
    setHover,
    clearHover,
    submit,
    reset,
  }
}
