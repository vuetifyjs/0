/**
 * @module QuestionRoot
 *
 * @remarks
 * Root component for multiple-choice questions. Uses v0's createSelection
 * for selection management, supporting both single and multi-answer modes.
 *
 * Used by Quest and Exam modes in the Discovery system.
 */

<script lang="ts">
  // Framework
  import { createContext, createSelection } from '@vuetify/v0'

  // Types
  import type { Ref } from 'vue'

  type ID = string | number

  /** Selection mode for the question */
  export type QuestionMode = 'single' | 'multiple'

  /** Result state after submission */
  export type QuestionResult = 'correct' | 'incorrect' | 'partial' | null

  export interface QuestionRootContext {
    /** Unique identifier for this question */
    readonly id: string
    /** Selection mode */
    readonly mode: QuestionMode
    /** Whether the question has been submitted */
    readonly isSubmitted: Ref<boolean>
    /** Result after submission */
    readonly result: Ref<QuestionResult>
    /** The correct answer value(s) */
    readonly correctAnswers: Set<string>
    /** Set of selected IDs */
    readonly selectedIds: Set<ID>
    /** Whether an option value is the correct answer */
    isCorrect: (value: string) => boolean
    /** Register an option */
    register: (option: { value: string, label?: string, disabled?: Ref<boolean> }) => {
      id: ID
      value: string
      isSelected: Ref<boolean>
      select: () => void
      unselect: () => void
      toggle: () => void
    }
    /** Unregister an option */
    unregister: (id: ID) => void
    /** Submit the answer */
    submit: () => void
    /** Reset the question */
    resetQuestion: () => void
    /** Get selected values */
    getSelectedValues: () => string[]
  }

  export interface QuestionRootProps {
    /** Unique identifier (auto-generated if not provided) */
    id?: string
    /**
     * Selection mode
     * - 'single': Only one answer can be selected (radio behavior)
     * - 'multiple': Multiple answers can be selected (checkbox behavior)
     * @default 'single'
     */
    mode?: QuestionMode
    /**
     * The correct answer(s)
     * - For single mode: a single string value
     * - For multiple mode: an array of string values
     */
    correctAnswer: string | string[]
    /**
     * Whether the question is disabled
     */
    disabled?: boolean
    /**
     * Namespace for context provision
     */
    namespace?: string
  }

  export interface QuestionRootSlotProps {
    /** Unique identifier */
    id: string
    /** Selection mode */
    mode: QuestionMode
    /** Currently selected answer values */
    selected: string[]
    /** Whether the question has been submitted */
    isSubmitted: boolean
    /** Whether the question is disabled */
    isDisabled: boolean
    /** Result after submission */
    result: QuestionResult
    /** Whether any option is selected */
    hasSelection: boolean
    /** Submit the answer */
    submit: () => void
    /** Reset the question */
    reset: () => void
  }

  export interface QuestionRootEmits {
    (e: 'submit', result: QuestionResult): void
    (e: 'update:modelValue', value: string | string[]): void
  }

  export const [useQuestionRoot, provideQuestionRoot] = createContext<QuestionRootContext>()
</script>

<script setup lang="ts">
  // Utilities
  import { computed, ref, toRef, useId as vueUseId, watch } from 'vue'

  defineOptions({ name: 'QuestionRoot' })

  const props = withDefaults(defineProps<QuestionRootProps>(), {
    mode: 'single',
    disabled: false,
    namespace: 'v0:question:root',
  })

  const emit = defineEmits<QuestionRootEmits>()

  defineSlots<{
    /**
     * Default slot with question state and actions
     */
    default: (props: QuestionRootSlotProps) => any
  }>()

  const model = defineModel<string | string[]>()

  const id = props.id ?? vueUseId()

  // Normalize correct answers to a Set
  const correctAnswers = computed(() => {
    const answers = Array.isArray(props.correctAnswer)
      ? props.correctAnswer
      : [props.correctAnswer]
    return new Set<string>(answers)
  })

  // Submission state
  const isSubmitted = ref(false)
  const result = ref<QuestionResult>(null)

  // Use v0's createSelection for selection management
  const selection = createSelection({
    multiple: props.mode === 'multiple',
    disabled: toRef(() => props.disabled || isSubmitted.value),
  })

  // Map from ticket ID to value for reverse lookup
  const idToValue = new Map<ID, string>()

  // Sync selection back to v-model
  watch(() => selection.selectedIds.size, () => {
    const values = getSelectedValues()
    model.value = props.mode === 'single' ? values[0] : values
  })

  function getSelectedValues (): string[] {
    const values: string[] = []
    for (const ticketId of selection.selectedIds) {
      const value = idToValue.get(ticketId)
      if (value !== undefined) values.push(value)
    }
    return values
  }

  function isCorrect (value: string): boolean {
    return correctAnswers.value.has(value)
  }

  function register (option: { value: string, label?: string, disabled?: Ref<boolean> }) {
    const ticket = selection.register({
      value: option.value,
      disabled: option.disabled ?? ref(false),
    })

    idToValue.set(ticket.id, option.value)

    return {
      id: ticket.id,
      value: option.value,
      isSelected: ticket.isSelected,
      select: ticket.select,
      unselect: ticket.unselect,
      toggle: ticket.toggle,
    }
  }

  function unregister (ticketId: ID) {
    idToValue.delete(ticketId)
    selection.unregister(ticketId)
  }

  function submit () {
    if (props.disabled || isSubmitted.value || selection.selectedIds.size === 0) return

    isSubmitted.value = true

    // Calculate result
    const selectedValues = getSelectedValues()
    const correctArr = Array.from(correctAnswers.value)

    if (props.mode === 'single') {
      result.value = selectedValues[0] === correctArr[0] ? 'correct' : 'incorrect'
    } else {
      // Multiple mode: check if all correct answers are selected and no incorrect ones
      const allCorrectSelected = correctArr.every(a => selectedValues.includes(a))
      const noIncorrectSelected = selectedValues.every(a => correctAnswers.value.has(a))

      if (allCorrectSelected && noIncorrectSelected) {
        result.value = 'correct'
      } else if (selectedValues.some(a => correctAnswers.value.has(a))) {
        result.value = 'partial'
      } else {
        result.value = 'incorrect'
      }
    }

    emit('submit', result.value)
  }

  function resetQuestion () {
    selection.reset()
    isSubmitted.value = false
    result.value = null
  }

  const context: QuestionRootContext = {
    id,
    mode: props.mode,
    isSubmitted,
    result,
    correctAnswers: correctAnswers.value,
    selectedIds: selection.selectedIds,
    isCorrect,
    register,
    unregister,
    submit,
    resetQuestion,
    getSelectedValues,
  }

  provideQuestionRoot(props.namespace, context)

  const slotProps = toRef((): QuestionRootSlotProps => ({
    id,
    mode: props.mode,
    selected: getSelectedValues(),
    isSubmitted: isSubmitted.value,
    isDisabled: props.disabled,
    result: result.value,
    hasSelection: selection.selectedIds.size > 0,
    submit,
    reset: resetQuestion,
  }))
</script>

<template>
  <div
    :id
    :aria-labelledby="`${id}-stem`"
    :data-question-mode="mode"
    :data-question-result="result"
    :data-question-submitted="isSubmitted || undefined"
    role="group"
  >
    <slot v-bind="slotProps" />
  </div>
</template>
