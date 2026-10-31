<script lang="ts">
  // Framework
  import { useLocale } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BSpinnerProps {
    /** Swap `.spinner-border` for `.spinner-grow`. */
    grow?: boolean
    /** Add `.spinner-sm`. */
    small?: boolean
    /**
     * `rotate` renders the separate `svg.spinner-rotate` icon.
     * It is not a modifier of `.spinner-border`.
     */
    variant?: 'rotate'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BSpinner' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    grow = false,
    small = false,
    variant,
  } = defineProps<BSpinnerProps>()

  const locale = useLocale()
  const label = toRef(() => locale.ti('Spinner.label') ?? 'Loading')
  const classes = toRef(() => {
    const list = [grow ? 'spinner-grow' : 'spinner-border']
    if (small) list.push('spinner-sm')
    return list
  })
</script>

<template>
  <svg
    v-if="variant === 'rotate'"
    :aria-label="label"
    class="bi spinner-rotate"
    fill="none"
    role="status"
    stroke="currentcolor"
    stroke-linecap="round"
    stroke-width="2"
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 1V4" />
    <path d="M3.05 3.05L5.17 5.17" opacity="0.8" />
    <path d="M4 8L1 8" opacity="0.6" />
    <path d="M5.17 10.83L3.05 12.95" opacity="0.5" />
    <path d="M8 12V15" opacity="0.4" />
    <path d="M10.83 10.83L12.95 12.95" opacity="0.3" />
    <path d="M15 8L12 8" opacity="0.2" />
    <path d="M12.95 3.05L10.83 5.17" opacity="0.1" />
  </svg>

  <div
    v-else
    :class="classes"
    role="status"
  >
    <span class="visually-hidden"><slot>{{ label }}</slot></span>
  </div>
</template>
