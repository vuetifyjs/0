export { provideQuestionRoot, default as QuestionRoot, useQuestionRoot } from './QuestionRoot.vue'
export { default as QuestionStem } from './QuestionStem.vue'
export { provideQuestionOption, default as QuestionOption, useQuestionOption } from './QuestionOption.vue'
export { default as QuestionIndicator } from './QuestionIndicator.vue'
export { default as QuestionFeedback } from './QuestionFeedback.vue'

export type {
  QuestionMode,
  QuestionResult,
  QuestionRootContext,
  QuestionRootProps,
  QuestionRootSlotProps,
} from './QuestionRoot.vue'

export type {
  QuestionOptionContext,
  QuestionOptionProps,
  QuestionOptionSlotProps,
  QuestionOptionState,
} from './QuestionOption.vue'

export type { QuestionFeedbackSlotProps } from './QuestionFeedback.vue'

// Components
import Feedback from './QuestionFeedback.vue'
import Indicator from './QuestionIndicator.vue'
import Option from './QuestionOption.vue'
import Root from './QuestionRoot.vue'
import Stem from './QuestionStem.vue'

/**
 * Question component for multiple-choice questions in Discovery.
 * Built on v0's createSelection for single/multi-answer modes.
 *
 * Used by Quest and Exam modes.
 *
 * @example Single choice (radio mode)
 * ```vue
 * <script setup lang="ts">
 *   import { Question } from '@/components/discovery/Question'
 *   import { ref } from 'vue'
 *
 *   const answer = ref<string>()
 * </script>
 *
 * <template>
 *   <Question.Root v-model="answer" correct-answer="b">
 *     <Question.Stem>
 *       What composable provides single selection?
 *     </Question.Stem>
 *
 *     <Question.Option value="a">
 *       <Question.Indicator>✓</Question.Indicator>
 *       createMultiple
 *     </Question.Option>
 *
 *     <Question.Option value="b">
 *       <Question.Indicator>✓</Question.Indicator>
 *       createSingle
 *     </Question.Option>
 *
 *     <Question.Option value="c">
 *       <Question.Indicator>✓</Question.Indicator>
 *       createGroup
 *     </Question.Option>
 *
 *     <Question.Feedback>
 *       <template #correct>That's right!</template>
 *       <template #incorrect>Not quite. Try again!</template>
 *     </Question.Feedback>
 *   </Question.Root>
 * </template>
 * ```
 *
 * @example Multiple choice (checkbox mode)
 * ```vue
 * <template>
 *   <Question.Root
 *     v-model="answers"
 *     mode="multiple"
 *     :correct-answer="['a', 'c']"
 *   >
 *     <Question.Stem>
 *       Which are valid v0 composables? (Select all that apply)
 *     </Question.Stem>
 *
 *     <Question.Option value="a">useHotkey</Question.Option>
 *     <Question.Option value="b">useVuetify</Question.Option>
 *     <Question.Option value="c">useEventListener</Question.Option>
 *
 *     <Question.Feedback>
 *       <template #correct>All correct!</template>
 *       <template #partial>Partially correct.</template>
 *       <template #incorrect>None of those are correct.</template>
 *     </Question.Feedback>
 *   </Question.Root>
 * </template>
 * ```
 */
export const Question = {
  /**
   * Root component that provides question context.
   * Uses v0's createSelection for selection management.
   */
  Root,
  /**
   * Semantic wrapper for the question text.
   * Provides proper accessibility labeling.
   */
  Stem,
  /**
   * Individual answer option.
   * Registers with parent selection context.
   * Behaves like a radio (single) or checkbox (multiple).
   */
  Option,
  /**
   * Visual indicator for selected state.
   * Only renders when option is selected.
   */
  Indicator,
  /**
   * Feedback shown after submission.
   * Supports named slots for correct/incorrect/partial.
   */
  Feedback,
}
