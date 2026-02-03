/**
 * @module QuestionIndicator
 *
 * @remarks
 * Visual indicator for option selection state.
 * Only renders content when the option is selected.
 * Must be used within a QuestionOption component.
 */

<script setup lang="ts">
  // Components
  import { useQuestionOption } from './QuestionOption.vue'

  // Utilities
  import { toValue } from 'vue'

  defineOptions({ name: 'QuestionIndicator' })

  const {
    namespace = 'v0:question:option',
  } = defineProps<{
    /** Namespace for connecting to parent QuestionOption */
    namespace?: string
  }>()

  defineSlots<{
    /** Content shown when option is selected */
    default: () => any
  }>()

  const option = useQuestionOption(namespace)
</script>

<template>
  <span
    v-if="toValue(option.isSelected)"
    aria-hidden="true"
    data-question-indicator
  >
    <slot />
  </span>
</template>
