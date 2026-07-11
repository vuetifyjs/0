<script setup lang="ts">
  // Framework
  import { createStep } from '@vuetify/v0'

  // Components
  import { Question } from '@/components/discovery/Question'

  // Composables
  import { useQuestions } from '@/composables/useQuestions'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  // Types
  import type { QuestionResult } from '@/components/discovery/Question'

  const { track } = defineProps<{ track: string }>()

  const questions = useQuestions()
  const pool = toRef(() => questions.byTrack(track))

  const step = createStep()
  const open = shallowRef(false)
  const finished = shallowRef(false)
  const results = ref(new Map<string, QuestionResult>())

  const current = toRef(() => pool.value.find(question => question.id === step.selectedId.value))
  const index = toRef(() => step.selectedIndex.value)
  const total = toRef(() => pool.value.length)
  const isLast = toRef(() => index.value === total.value - 1)
  const score = toRef(() => [...results.value.values()].filter(result => result === 'correct').length)
  const progress = toRef(() => `${Math.round(((index.value + 1) / total.value) * 100)}%`)

  function shuffle (ids: string[]): string[] {
    const next = ids.slice()
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }

  function begin () {
    step.clear()
    step.onboard(shuffle(pool.value.map(question => question.id)).map(id => ({ id, value: id })))
    results.value = new Map()
    finished.value = false
    step.first()
  }

  function onStart () {
    begin()
    open.value = true
  }

  function onAnswer (result: QuestionResult) {
    results.value.set(step.selectedId.value as string, result)
  }

  function onNext () {
    if (isLast.value) finished.value = true
    else step.next()
  }
</script>

<template>
  <div
    v-if="pool.length > 0"
    class="my-6 rounded-lg border border-divider bg-surface p-4"
  >
    <!-- Invite -->
    <div
      v-if="!open"
      class="flex flex-col items-start gap-1"
    >
      <p class="text-sm font-medium text-on-surface">
        Check your understanding
      </p>

      <p class="text-sm text-on-surface-variant">
        Take a quick {{ pool.length }}-question quiz to test what you just learned.
      </p>

      <button
        :aria-controls="`${track}-quiz`"
        aria-expanded="false"
        class="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
        @click="onStart"
      >
        Start quiz
      </button>
    </div>

    <!-- Results -->
    <div
      v-else-if="finished"
      :id="`${track}-quiz`"
      class="flex flex-col items-start gap-2"
    >
      <p class="text-sm font-medium text-on-surface">
        Quiz complete
      </p>

      <p class="text-2xl font-semibold text-on-surface">
        {{ score }} / {{ total }}
      </p>

      <p class="text-sm text-on-surface-variant">
        {{ score === total ? 'Perfect score.' : 'Review the answers and try again.' }}
      </p>

      <button
        class="mt-2 inline-flex items-center gap-2 rounded-md border border-divider px-3 py-1.5 text-sm text-on-surface hover:bg-surface-variant transition-colors"
        title="Try again"
        type="button"
        @click="onStart"
      >
        <AppIcon icon="restart" :size="16" />
        Try again
      </button>
    </div>

    <!-- Question -->
    <div
      v-else
      :id="`${track}-quiz`"
    >
      <div class="mb-3 flex items-center gap-3">
        <span class="text-xs font-medium text-on-surface-variant whitespace-nowrap">
          Question {{ index + 1 }} of {{ total }}
        </span>

        <div class="h-1 flex-1 overflow-hidden rounded-full bg-surface-variant">
          <div
            class="h-full rounded-full bg-primary transition-all"
            :style="{ width: progress }"
          />
        </div>
      </div>

      <Question.Root
        v-if="current"
        :key="current.id"
        v-slot="{ submit, isSubmitted, hasSelection, result }"
        :correct-answer="current.correctAnswers"
        :mode="current.mode"
        @submit="onAnswer"
      >
        <Question.Stem class="mb-3 block font-medium text-on-surface">
          {{ current.stem }}
        </Question.Stem>

        <div class="flex flex-col gap-2">
          <Question.Option
            v-for="option in current.options"
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
          {{ current.feedback }}
        </Question.Feedback>

        <button
          v-if="isSubmitted"
          class="mt-3 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
          type="button"
          @click="onNext"
        >
          {{ isLast ? 'Finish' : 'Next' }}
        </button>
      </Question.Root>
    </div>
  </div>
</template>
