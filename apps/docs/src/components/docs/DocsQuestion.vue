<script setup lang="ts">
  // Framework
  import { createStep } from '@vuetify/v0'

  // Components
  import { Question } from '@/components/discovery/Question'
  import SkillLevelBadge from '@/components/skillz/SkillLevelBadge.vue'
  import SkillMasteredBadge from '@/components/skillz/SkillMasteredBadge.vue'

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
  const order = shallowRef<string[]>([])

  const ordered = toRef(() => order.value.flatMap(id => {
    const question = pool.value.find(item => item.id === id)
    return question ? [question] : []
  }))
  const currentId = toRef(() => step.selectedId.value)
  const currentLevel = toRef(() => ordered.value.find(question => question.id === currentId.value)?.level)
  const index = toRef(() => step.selectedIndex.value)
  const total = toRef(() => pool.value.length)
  const isLast = toRef(() => index.value === total.value - 1)
  const score = toRef(() => [...results.value.values()].filter(result => result === 'correct').length)

  function shuffle (ids: string[]): string[] {
    const next = ids.slice()
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }

  function begin () {
    const ids = shuffle(pool.value.map(question => question.id))
    order.value = ids
    step.clear()
    step.onboard(ids.map(id => ({ id, value: id })))
    results.value = new Map()
    finished.value = false
    step.first()
  }

  function onStart () {
    begin()
    open.value = true
  }

  function onAnswer (id: string, result: QuestionResult) {
    results.value.set(id, result)
  }

  function onPrev () {
    step.prev()
  }

  function onNext () {
    if (isLast.value) finished.value = true
    else step.next()
  }
</script>

<template>
  <div
    v-if="pool.length > 0"
    class="relative my-6 overflow-hidden rounded-lg border border-divider bg-surface p-4"
  >
    <AppDotGrid :coverage="60" />

    <!-- Invite -->
    <div
      v-if="!open"
      class="relative flex flex-col items-start gap-1"
    >
      <p class="flex items-center gap-1.5 text-sm font-medium text-on-surface">
        <AppIcon class="text-warning" icon="medal" :size="16" />
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
      class="relative flex flex-col items-start gap-2"
    >
      <SkillMasteredBadge v-if="score === total" :size="28" />

      <p class="text-sm font-medium text-on-surface">
        {{ score === total ? 'Skill mastered' : 'Quiz complete' }}
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
      class="relative"
    >
      <div class="mb-3 flex items-center gap-2">
        <AppIcon class="text-on-surface-variant" icon="puzzle" :size="16" />

        <span class="text-xs font-medium text-on-surface-variant whitespace-nowrap">
          Question {{ index + 1 }} of {{ total }}
        </span>

        <SkillLevelBadge
          v-if="currentLevel"
          class="ml-auto"
          :level="currentLevel"
        />
      </div>

      <Question.Root
        v-for="question in ordered"
        v-show="question.id === currentId"
        :key="question.id"
        v-slot="{ submit, isSubmitted, hasSelection, result }"
        :correct-answer="question.correctAnswers"
        :mode="question.mode"
        @submit="onAnswer(question.id, $event)"
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
              class="flex w-full items-center gap-2.5 rounded-md border border-divider px-3 py-2 text-sm text-on-surface transition-colors"
              :class="[
                isSelected && !submitted ? 'border-primary bg-primary/10' : '',
                submitted && isCorrect ? 'border-success bg-success/10' : '',
                submitted && isSelected && !isCorrect ? 'border-error bg-error/10' : '',
              ]"
            >
              <span
                class="inline-flex size-4 shrink-0 items-center justify-center border-2 transition-colors"
                :class="[
                  question.mode === 'multiple' ? 'rounded-sm' : 'rounded-full',
                  isSelected
                    ? (question.mode === 'multiple' ? 'border-primary bg-primary text-on-primary' : 'border-primary')
                    : 'border-on-surface-variant',
                ]"
              >
                <AppIcon
                  v-if="question.mode === 'multiple' && isSelected"
                  icon="check"
                  :size="12"
                />

                <span
                  v-else-if="question.mode !== 'multiple' && isSelected"
                  class="size-1.5 rounded-full bg-primary"
                />
              </span>

              {{ option.label }}
            </span>
          </Question.Option>
        </div>

        <Question.Feedback
          class="mt-3 block rounded-md p-3 text-sm"
          :class="result === 'correct' ? 'bg-success/10 text-on-surface' : 'bg-warning/10 text-on-surface'"
        >
          {{ question.feedback }}
        </Question.Feedback>

        <div class="mt-4 flex items-center gap-2">
          <button
            class="inline-flex items-center gap-1 rounded-md border border-divider px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-40"
            :disabled="index === 0"
            type="button"
            @click="onPrev"
          >
            <AppIcon icon="left" :size="16" />
            Back
          </button>

          <button
            v-if="!isSubmitted"
            class="ml-auto rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary disabled:opacity-50"
            :disabled="!hasSelection"
            @click="submit"
          >
            Check answer
          </button>

          <button
            v-else
            class="ml-auto inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
            type="button"
            @click="onNext"
          >
            {{ isLast ? 'Finish' : 'Next' }}
            <AppIcon v-if="!isLast" icon="right" :size="16" />
          </button>
        </div>
      </Question.Root>
    </div>
  </div>
</template>
