/**
 * @module QuestionOption
 *
 * @remarks
 * Individual answer option for a question. Registers with parent
 * QuestionRoot's selection context. Uses v0's Atom for polymorphic rendering.
 */

<script lang="ts">
  // Framework
// v0
  import { Atom, createContext } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  export type QuestionOptionState = 'selected' | 'unselected'

  export interface QuestionOptionContext {
    /** The option's value */
    readonly value: string
    /** Whether this option is selected */
    readonly isSelected: Ref<boolean>
    /** Whether this option is the correct answer */
    readonly isCorrect: boolean
    /** Whether the question has been submitted */
    readonly isSubmitted: Ref<boolean>
  }

  export interface QuestionOptionProps extends AtomProps {
    /** Value for this option (used for selection tracking) */
    value: string
    /** Optional display label */
    label?: string
    /** Whether this option is disabled */
    disabled?: boolean
    /** Namespace for connecting to parent QuestionRoot */
    questionNamespace?: string
    /** Namespace for context provision to children (Indicator) */
    namespace?: string
  }

  export interface QuestionOptionSlotProps {
    /** The option's value */
    value: string
    /** Optional display label */
    label?: string
    /** Whether this option is selected */
    isSelected: boolean
    /** Whether this option is the correct answer (only meaningful after submit) */
    isCorrect: boolean
    /** Whether this option is disabled */
    isDisabled: boolean
    /** Whether the question has been submitted */
    isSubmitted: boolean
    /** Visual state for styling */
    state: QuestionOptionState
    /** Select this option */
    select: () => void
    /** Toggle this option */
    toggle: () => void
    /** Attributes to bind to the option element */
    attrs: {
      'type': 'button' | undefined
      'role': 'radio' | 'checkbox'
      'aria-checked': boolean
      'aria-disabled': boolean | undefined
      'tabindex': 0 | -1
      'data-state': QuestionOptionState
      'data-correct': boolean | undefined
      'data-disabled': true | undefined
    }
  }

  export const [useQuestionOption, provideQuestionOption] = createContext<QuestionOptionContext>()
</script>

<script setup lang="ts">
  // Components
  import { useQuestionRoot } from './QuestionRoot.vue'

  // Utilities
  import { computed, onUnmounted, toRef, toValue, useAttrs } from 'vue'

  defineOptions({ name: 'QuestionOption', inheritAttrs: false })

  const attrs = useAttrs()

  const props = withDefaults(defineProps<QuestionOptionProps>(), {
    as: 'button',
    disabled: false,
    questionNamespace: 'v0:question:root',
    namespace: 'v0:question:option',
  })

  defineSlots<{
    /**
     * Default slot with option state and actions
     */
    default: (props: QuestionOptionSlotProps) => any
  }>()

  const question = useQuestionRoot(props.questionNamespace)

  // Register with parent selection context
  const ticket = question.register({
    value: props.value,
    label: props.label,
    disabled: toRef(() => props.disabled),
  })

  const isSelected = ticket.isSelected
  const isCorrect = question.isCorrect(props.value)
  const isDisabled = toRef(() => props.disabled || toValue(question.isSubmitted))
  const state = computed((): QuestionOptionState => toValue(isSelected) ? 'selected' : 'unselected')

  // Roving tabindex for keyboard navigation
  const isTabbable = computed(() => {
    if (isDisabled.value) return false
    if (toValue(isSelected)) return true
    // First option is tabbable when none selected
    return question.selectedIds.size === 0
  })

  function onClick () {
    if (isDisabled.value) return

    if (question.mode === 'single') {
      ticket.select()
    } else {
      ticket.toggle()
    }
  }

  function onKeydown (e: KeyboardEvent) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onClick()
    }
  }

  onUnmounted(() => {
    question.unregister(ticket.id)
  })

  const context: QuestionOptionContext = {
    value: props.value,
    isSelected,
    isCorrect,
    isSubmitted: question.isSubmitted,
  }

  provideQuestionOption(props.namespace, context)

  const slotProps = toRef((): QuestionOptionSlotProps => ({
    value: props.value,
    label: props.label,
    isSelected: toValue(isSelected),
    isCorrect,
    isDisabled: isDisabled.value,
    isSubmitted: toValue(question.isSubmitted),
    state: state.value,
    select: ticket.select,
    toggle: ticket.toggle,
    attrs: {
      'type': props.as === 'button' ? 'button' : undefined,
      'role': question.mode === 'single' ? 'radio' : 'checkbox',
      'aria-checked': toValue(isSelected),
      'aria-disabled': isDisabled.value || undefined,
      'tabindex': isTabbable.value ? 0 : -1,
      'data-state': state.value,
      'data-correct': toValue(question.isSubmitted) ? isCorrect : undefined,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="{ ...attrs, ...slotProps.attrs }"
    :as
    :data-question-option="value"
    :renderless
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
