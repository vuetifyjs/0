<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BFormFeedbackProps {
    /**
     * Renders `.valid-feedback` instead of `.invalid-feedback`.
     *
     * @default false
     */
    valid?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormFeedback' })

  defineSlots<{
    default?: () => any
  }>()

  const { valid = false } = defineProps<BFormFeedbackProps>()

  const feedbackClass = toRef(() => valid ? 'valid-feedback' : 'invalid-feedback')
</script>

<template>
  <div :class="feedbackClass">
    <slot />
  </div>
</template>
