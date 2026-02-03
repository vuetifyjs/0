/**
 * @module QuestionStem
 *
 * @remarks
 * Semantic wrapper for the question text/prompt.
 * Provides proper labeling for accessibility.
 */

<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface QuestionStemProps extends AtomProps {
    /** Namespace for connecting to parent QuestionRoot */
    namespace?: string
  }
</script>

<script setup lang="ts">
  // Components
  import { useQuestionRoot } from './QuestionRoot.vue'

  defineOptions({ name: 'QuestionStem' })

  const {
    as = 'div',
    renderless,
    namespace = 'v0:question:root',
  } = defineProps<QuestionStemProps>()

  defineSlots<{
    /** The question text */
    default: () => any
  }>()

  const question = useQuestionRoot(namespace)
</script>

<template>
  <Atom
    :id="`${question.id}-stem`"
    :as
    data-question-stem
    :renderless
  >
    <slot />
  </Atom>
</template>
