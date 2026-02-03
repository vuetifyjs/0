/**
 * @module QuestionOption
 *
 * @remarks
 * Individual answer option for a question. Registers with parent
 * QuestionRoot's selection context. Uses v0's Atom for polymorphic rendering.
 */

<script lang="ts">
  // Framework
  import { Atom, createContext } from '@vuetify/v0'

  // Types
  import type { AtomExpose, AtomProps } from '@vuetify/v0'
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
    /** Accessible label for this option */
    ariaLabel?: string
    /** ID of element that labels this option */
    ariaLabelledby?: string
    /** ID of element that describes this option */
    ariaDescribedby?: string
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
      'aria-label': string | undefined
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
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
  import { computed, onUnmounted, toRef, toValue, useAttrs, useTemplateRef } from 'vue'

  defineOptions({ name: 'QuestionOption', inheritAttrs: false })

  const attrs = useAttrs()
  const rootRef = useTemplateRef<AtomExpose>('root')

  const {
    as = 'button',
    renderless,
    value,
    label,
    disabled = false,
    questionNamespace = 'v0:question:root',
    namespace = 'v0:question:option',
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
  } = defineProps<QuestionOptionProps>()

  defineSlots<{
    /**
     * Default slot with option state and actions
     */
    default: (props: QuestionOptionSlotProps) => any
  }>()

  const question = useQuestionRoot(questionNamespace)

  // Element ref for focus management during arrow key navigation
  const el = toRef(() => (rootRef.value?.element as HTMLElement | null | undefined) ?? undefined)

  // Register with parent selection context
  const ticket = question.register({
    value,
    label,
    disabled: toRef(() => disabled),
    el,
  })

  const isSelected = ticket.isSelected
  const isCorrect = question.isCorrect(value)
  const isDisabled = toRef(() => disabled || toValue(question.isSubmitted))
  const state = computed((): QuestionOptionState => toValue(isSelected) ? 'selected' : 'unselected')

  // Roving tabindex: tabbable if selected, or first non-disabled when none selected
  const isTabbable = computed(() => {
    if (isDisabled.value) return false
    if (toValue(isSelected)) return true
    if (question.selectedIds.size > 0) return false
    // First non-disabled option is tabbable when none selected
    for (const item of question.values()) {
      if (!toValue(item.disabled)) return item.id === ticket.id
    }
    return false
  })

  function select () {
    if (isDisabled.value) return

    if (toValue(question.mode) === 'single') {
      ticket.select()
    } else {
      ticket.toggle()
    }
  }

  function onClick () {
    select()
  }

  function onKeydown (e: KeyboardEvent) {
    // Enter/Space always selects
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      select()
      return
    }

    // Arrow key navigation only for single mode (radio behavior)
    if (toValue(question.mode) !== 'single') return

    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
    if (!keys.includes(e.key)) return

    e.preventDefault()

    const items = [...question.values()].filter(item => !toValue(item.disabled))
    const currentIndex = items.findIndex(item => item.id === ticket.id)
    if (currentIndex === -1) return

    let nextIndex: number
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    } else {
      nextIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
    }

    const nextItem = items[nextIndex]
    if (!nextItem) return

    // Radio pattern: selection follows focus
    nextItem.select()
    toValue(nextItem.el)?.focus()
  }

  onUnmounted(() => {
    question.unregister(ticket.id)
  })

  const context: QuestionOptionContext = {
    value,
    isSelected,
    isCorrect,
    isSubmitted: question.isSubmitted,
  }

  provideQuestionOption(namespace, context)

  const slotProps = toRef((): QuestionOptionSlotProps => ({
    value,
    label,
    isSelected: toValue(isSelected),
    isCorrect,
    isDisabled: isDisabled.value,
    isSubmitted: toValue(question.isSubmitted),
    state: state.value,
    select: ticket.select,
    toggle: ticket.toggle,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'role': toValue(question.mode) === 'single' ? 'radio' : 'checkbox',
      'aria-checked': toValue(isSelected),
      'aria-disabled': isDisabled.value || undefined,
      'aria-label': ariaLabel || label || undefined,
      'aria-labelledby': ariaLabelledby || undefined,
      'aria-describedby': ariaDescribedby || undefined,
      'tabindex': isTabbable.value ? 0 : -1,
      'data-state': state.value,
      'data-correct': toValue(question.isSubmitted) ? isCorrect : undefined,
      'data-disabled': isDisabled.value ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    ref="root"
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
