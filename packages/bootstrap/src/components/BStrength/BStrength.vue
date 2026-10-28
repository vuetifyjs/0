<script lang="ts">
  // Framework
  import { clamp, isNumber, isUndefined } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export type BStrengthVariant = 'segments' | 'bar'

  export interface BStrengthProps {
    /**
     * Segment count when `0`–`4`. Above `4`, a percentage of 100 mapped onto
     * four segments. This component does not score a password.
     */
    value?: number
    /** `segments` renders `.strength`. `bar` renders `.strength-bar`. */
    variant?: BStrengthVariant
    /** When set, renders `span.strength-text` after the meter. */
    text?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BStrength', inheritAttrs: false })

  const {
    value = 0,
    variant = 'segments',
    text,
  } = defineProps<BStrengthProps>()

  const attrs = useAttrs()

  const levels = ['weak', 'fair', 'good', 'strong'] as const

  const amount = toRef(() => isNumber(value) && Number.isFinite(value) ? value : 0)

  const filled = toRef(() => {
    const scaled = amount.value <= 4 ? amount.value : (amount.value / 100) * 4
    return clamp(Math.round(scaled), 0, 4)
  })

  const level = toRef(() => filled.value === 0 ? undefined : levels[filled.value - 1])

  const barWidth = toRef(() => {
    if (amount.value <= 4) return `${(clamp(amount.value, 0, 4) / 4) * 100}%`
    return `${clamp(amount.value, 0, 100)}%`
  })

  function isActive (index: number) {
    return index <= filled.value
  }
</script>

<template>
  <div
    v-if="variant === 'bar'"
    v-bind="attrs"
    class="strength-bar"
    :data-bs-strength="level"
    :style="{ '--bs-strength-width': barWidth }"
  />

  <div
    v-else
    v-bind="attrs"
    class="strength"
    :data-bs-strength="level"
  >
    <div
      v-for="index in 4"
      :key="index"
      class="strength-segment"
      :class="{ active: isActive(index) }"
    />
  </div>

  <span
    v-if="!isUndefined(text) && text !== ''"
    class="strength-text"
  >{{ text }}</span>
</template>
