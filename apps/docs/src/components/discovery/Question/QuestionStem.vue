/**
 * @module QuestionStem
 *
 * @remarks
 * Semantic wrapper for the question text/prompt.
 * Provides proper labeling for accessibility.
 */

<script setup lang="ts">
  // Components
  import { useQuestionRoot } from './QuestionRoot.vue'

  defineOptions({ name: 'QuestionStem' })

  const {
    namespace = 'v0:question:root',
  } = defineProps<{
    /** Namespace for connecting to parent QuestionRoot */
    namespace?: string
  }>()

  defineSlots<{
    /** The question text */
    default: () => any
  }>()

  const question = useQuestionRoot(namespace)
</script>

<template>
  <div
    :id="`${question.id}-stem`"
    class="question-stem"
    data-question-stem
  >
    <slot />
  </div>
</template>
