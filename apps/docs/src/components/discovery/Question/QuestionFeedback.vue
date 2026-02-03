/**
 * @module QuestionFeedback
 *
 * @remarks
 * Displays feedback after question submission.
 * Shows different content based on whether the answer was correct,
 * incorrect, or partially correct.
 */

<script lang="ts">
  // Types
  import type { QuestionResult } from './QuestionRoot.vue'

  export interface QuestionFeedbackSlotProps {
    /** The result of the submission */
    result: QuestionResult
    /** Whether the answer was correct */
    isCorrect: boolean
    /** Whether the answer was incorrect */
    isIncorrect: boolean
    /** Whether the answer was partially correct (multiple mode only) */
    isPartial: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { useQuestionRoot } from './QuestionRoot.vue'

  // Utilities
  import { computed, toValue } from 'vue'

  defineOptions({ name: 'QuestionFeedback' })

  const {
    namespace = 'v0:question:root',
  } = defineProps<{
    /** Namespace for connecting to parent QuestionRoot */
    namespace?: string
  }>()

  defineSlots<{
    /** Default slot shown for any result */
    default?: (props: QuestionFeedbackSlotProps) => any
    /** Slot shown when answer is correct */
    correct?: () => any
    /** Slot shown when answer is incorrect */
    incorrect?: () => any
    /** Slot shown when answer is partially correct */
    partial?: () => any
  }>()

  const question = useQuestionRoot(namespace)

  const result = computed(() => toValue(question.result))
  const isSubmitted = computed(() => toValue(question.isSubmitted))

  const slotProps = computed((): QuestionFeedbackSlotProps => ({
    result: result.value,
    isCorrect: result.value === 'correct',
    isIncorrect: result.value === 'incorrect',
    isPartial: result.value === 'partial',
  }))
</script>

<template>
  <div
    v-if="isSubmitted"
    aria-live="polite"
    :data-question-feedback="result"
    role="status"
  >
    <!-- Named slots for specific results -->
    <template v-if="result === 'correct' && $slots.correct">
      <slot name="correct" />
    </template>
    <template v-else-if="result === 'incorrect' && $slots.incorrect">
      <slot name="incorrect" />
    </template>
    <template v-else-if="result === 'partial' && $slots.partial">
      <slot name="partial" />
    </template>

    <!-- Default slot always available -->
    <slot v-bind="slotProps" />
  </div>
</template>
