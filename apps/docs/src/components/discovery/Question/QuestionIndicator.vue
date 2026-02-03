/**
 * @module QuestionIndicator
 *
 * @remarks
 * Visual indicator for option selection state.
 * Uses visibility for layout stability (element stays in DOM).
 * Must be used within a QuestionOption component.
 */

<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface QuestionIndicatorProps extends AtomProps {
    /** Namespace for connecting to parent QuestionOption */
    namespace?: string
  }

  export interface QuestionIndicatorSlotProps {
    /** Whether this option is selected */
    isSelected: boolean
    /** Attributes to bind to the indicator element */
    attrs: {
      'data-state': 'selected' | 'unselected'
      'style': { visibility: 'visible' | 'hidden' }
    }
  }
</script>

<script setup lang="ts">
  // Components
  import { useQuestionOption } from './QuestionOption.vue'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'QuestionIndicator' })

  const {
    as = 'span',
    renderless,
    namespace = 'v0:question:option',
  } = defineProps<QuestionIndicatorProps>()

  defineSlots<{
    /** Content shown when option is selected (visibility controlled) */
    default: (props: QuestionIndicatorSlotProps) => any
  }>()

  const option = useQuestionOption(namespace)

  const dataState = toRef(() => toValue(option.isSelected) ? 'selected' : 'unselected')

  const slotProps = toRef((): QuestionIndicatorSlotProps => ({
    isSelected: toValue(option.isSelected),
    attrs: {
      'data-state': dataState.value,
      'style': { visibility: toValue(option.isSelected) ? 'visible' : 'hidden' },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    aria-hidden="true"
    :as
    data-question-indicator
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
