<script setup lang="ts">
  // Components
  import { Question } from '@/components/discovery/Question'

  // Composables
  import { useQuestions } from '@/composables/useQuestions'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const { questionId } = defineProps<{ questionId: string }>()

  const questions = useQuestions()
  const question = toRef(() => questions.get(questionId))

  const open = shallowRef(false)

  function onStart () {
    open.value = true
  }
</script>

<template>
  <div
    v-if="question"
    class="my-6 rounded-lg border border-divider bg-surface p-4"
  >
    <div
      v-if="!open"
      class="flex flex-col items-start gap-1"
    >
      <p class="text-sm font-medium text-on-surface">
        Check your understanding
      </p>

      <p class="text-sm text-on-surface-variant">
        Take a quick quiz to test what you just learned.
      </p>

      <button
        :aria-controls="`${questionId}-quiz`"
        aria-expanded="false"
        class="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
        @click="onStart"
      >
        Start quiz
      </button>
    </div>

    <Question.Root
      v-else
      :id="`${questionId}-quiz`"
      v-slot="{ submit, reset, isSubmitted, hasSelection, result }"
      :correct-answer="question.correctAnswers"
      :mode="question.mode"
    >
      <Question.Stem class="mb-3 block font-medium text-on-surface">
        {{ question.stem }}
      </Question.Stem>

      <div class="flex flex-col gap-2">
        <Question.Option
          v-for="option in question.options"
          :key="option.value"
          v-slot="{ isSelected, isCorrect, isSubmitted: submitted }"
          class="block w-full cursor-pointer text-left"
          :value="option.value"
        >
          <span
            class="block rounded-md border border-divider px-3 py-2 text-sm text-on-surface transition-colors"
            :class="[
              isSelected && !submitted ? 'border-primary bg-primary/10' : '',
              submitted && isCorrect ? 'border-success bg-success/10' : '',
              submitted && isSelected && !isCorrect ? 'border-error bg-error/10' : '',
            ]"
          >{{ option.label }}</span>
        </Question.Option>
      </div>

      <button
        v-if="!isSubmitted"
        class="mt-3 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary disabled:opacity-50"
        :disabled="!hasSelection"
        @click="submit"
      >
        Check answer
      </button>

      <Question.Feedback
        class="mt-3 block rounded-md p-3 text-sm"
        :class="result === 'correct' ? 'bg-success/10 text-on-surface' : 'bg-warning/10 text-on-surface'"
      >
        {{ question.feedback }}
      </Question.Feedback>

      <div
        v-if="isSubmitted"
        class="mt-3 flex justify-end"
      >
        <button
          class="size-[30px] rounded text-on-surface-variant hover:bg-surface-variant transition-colors inline-flex items-center justify-center"
          title="Reset quiz"
          type="button"
          @click="reset"
        >
          <AppIcon icon="restart" :size="16" />
        </button>
      </div>
    </Question.Root>
  </div>
</template>
