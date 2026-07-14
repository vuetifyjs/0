<script setup lang="ts">
  // Framework
  import { createStep, isArray, isUndefined } from '@vuetify/v0'

  // Components
  import { Question } from '@/components/discovery/Question'
  import SkillMasteredBadge from '@/components/skillz/SkillMasteredBadge.vue'

  // Composables
  import { renderInline } from '@/composables/useMarkdown'
  import { distractorsNeeded, useQuestions } from '@/composables/useQuestions'

  import { SKILL_LEVEL_META } from '@/types/skill'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  // Types
  import type { QuestionResult } from '@/components/discovery/Question'
  import type { Question as QuestionDef, QuestionOption } from '@/composables/useQuestions'
  import type { SkillLevel } from '@/types/skill'

  const { track, count = 5, purpose = 'check' } = defineProps<{
    track: string
    count?: number
    /**
     * 'check' — a self-check quiz that scores understanding.
     * 'placement' — frames the quiz as a skill-level finder and, on completion,
     * emits `apply` with the suggested level so a host can act on it.
     */
    purpose?: 'check' | 'placement'
  }>()

  const emit = defineEmits<{ apply: [level: SkillLevel] }>()

  const placement = toRef(() => purpose === 'placement')

  interface Slate {
    id: string
    stem: string
    feedback?: string
    hint?: string
    level?: SkillLevel
    mode: 'single' | 'multiple'
    options: QuestionOption[]
    correctAnswers: string[]
  }

  const questions = useQuestions()
  const pool = toRef(() => questions.byTrack(track))
  const take = toRef(() => Math.min(count, pool.value.length))

  const step = createStep()
  const open = shallowRef(false)
  const finished = shallowRef(false)
  const results = ref(new Map<string, QuestionResult>())
  const answered = ref(new Map<string, string | string[]>())
  const revealed = ref(new Set<string>())
  const deck = ref<Slate[]>([])
  const run = shallowRef(0)

  const currentId = toRef(() => step.selectedId.value)
  const index = toRef(() => step.selectedIndex.value)
  const total = toRef(() => deck.value.length)
  const isLast = toRef(() => index.value === total.value - 1)
  const score = toRef(() => [...results.value.values()].filter(result => result === 'correct').length)

  const currentLevelMeta = toRef(() => {
    const level = deck.value.find(slate => slate.id === currentId.value)?.level
    return level ? SKILL_LEVEL_META[level] : undefined
  })

  const review = toRef(() => deck.value.map(slate => {
    const result = results.value.get(slate.id) ?? null
    return {
      ...slate,
      result,
      correct: result === 'correct',
      picked: labelsFor(slate, answered.value.get(slate.id)),
      solution: labelsFor(slate, slate.correctAnswers),
    }
  }))

  // Highest level the user cleared, requiring every lower level in the deck to
  // also pass. Drives the skill verdict on the results screen.
  const verdictLevel = toRef((): SkillLevel | 0 => {
    let determined: SkillLevel | 0 = 0
    for (const level of [1, 2, 3] as const) {
      const bucket = review.value.filter(item => item.level === level)
      if (bucket.length === 0) continue
      const ratio = bucket.filter(item => item.correct).length / bucket.length
      if (ratio >= 0.5) determined = level
      else break
    }
    return determined
  })
  const verdict = toRef(() => verdictLevel.value ? SKILL_LEVEL_META[verdictLevel.value] : undefined)

  function labelsFor (slate: Slate, values: string | string[] | undefined): string {
    const list = isUndefined(values) ? [] : (isArray(values) ? values : [values])
    return list
      .map(value => slate.options.find(option => option.value === value)?.label ?? value)
      .join(', ')
  }

  function shuffle<T> (items: T[]): T[] {
    const next = items.slice()
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[next[i], next[j]] = [next[j], next[i]]
    }
    return next
  }

  function sample<T> (items: T[], amount: number): T[] {
    return shuffle(items).slice(0, amount)
  }

  // Round-robin across level buckets so a short quiz still spans levels and the
  // verdict can gauge skill. Falls back to a plain shuffle when levels are absent.
  function pick (defs: QuestionDef[], amount: number): QuestionDef[] {
    const buckets = new Map<number, QuestionDef[]>()
    for (const def of defs) {
      const level = def.level ?? 0
      const bucket = buckets.get(level) ?? []
      bucket.push(def)
      buckets.set(level, bucket)
    }

    const ordered = [...buckets.entries()]
      .toSorted((a, b) => a[0] - b[0])
      .map(entry => shuffle(entry[1]))

    const picked: QuestionDef[] = []
    let cursor = 0
    while (picked.length < amount && ordered.some(bucket => bucket.length > 0)) {
      const bucket = ordered[cursor % ordered.length]
      const next = bucket.shift()
      if (next) picked.push(next)
      cursor++
    }

    return shuffle(picked)
  }

  function materialize (def: QuestionDef): Slate {
    const needed = distractorsNeeded(def.answers.length)
    const options = shuffle([...def.answers, ...sample(def.distractors, needed)])
    return {
      id: def.id,
      stem: def.stem,
      feedback: def.feedback,
      hint: def.hint,
      level: def.level,
      mode: def.mode,
      options,
      correctAnswers: def.correctAnswers,
    }
  }

  function begin () {
    run.value++
    deck.value = pick(pool.value, take.value).map(materialize)
    step.clear()
    step.onboard(deck.value.map(slate => ({ id: slate.id, value: slate.id })))
    results.value = new Map()
    answered.value = new Map()
    revealed.value = new Set()
    finished.value = false
    step.first()
  }

  function reveal (id: string) {
    revealed.value.add(id)
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

  function onSkip () {
    if (isLast.value) finished.value = true
    else step.next()
  }

  function go (to: number) {
    step.step(to - index.value)
  }

  function apply () {
    if (verdictLevel.value) emit('apply', verdictLevel.value)
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
        {{ placement ? 'Find your skill level' : 'Check your understanding' }}
      </p>

      <p class="text-sm text-on-surface-variant">
        <template v-if="placement">Answer {{ take }} quick questions and we'll suggest where to start.</template>
        <template v-else>Take a quick {{ take }}-question quiz to test what you just learned.</template>
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
      class="relative flex flex-col items-stretch gap-4"
    >
      <div class="flex flex-col items-start gap-2">
        <SkillMasteredBadge v-if="score === total" :size="28" />

        <span
          v-else-if="verdict"
          class="skillz-badge inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide"
          :style="{ '--level-color': verdict.color }"
        >
          {{ verdict.label }}
          <AppIcon :icon="verdict.icon" :size="14" />
        </span>

        <p class="text-sm font-medium text-on-surface">
          {{ score === total ? 'Skill mastered' : 'Quiz complete' }}
        </p>

        <p class="text-2xl font-semibold text-on-surface">
          {{ score }} / {{ total }}
        </p>

        <p v-if="placement" class="text-sm text-on-surface-variant">
          <template v-if="verdict">Based on your answers, we suggest starting at the {{ verdict.label }} level. Apply it to the filter, or review the misses below.</template>
          <template v-else>Start with the beginner material — retake this once the fundamentals click.</template>
        </p>

        <p v-else class="text-sm text-on-surface-variant">
          <template v-if="score === total">Perfect score — you've got this cold.</template>
          <template v-else-if="verdict">You're performing at the {{ verdict.label }} level. Review the misses below and try again.</template>
          <template v-else>Keep practicing the fundamentals, then try again.</template>
        </p>
      </div>

      <!-- Per-question review -->
      <ul class="flex flex-col gap-2">
        <li
          v-for="item in review"
          :key="item.id"
          class="flex items-start gap-2.5 rounded-md border border-divider p-3 text-sm"
          :class="item.correct ? 'bg-success/5' : item.result ? 'bg-error/5' : 'bg-surface-variant/30'"
        >
          <AppIcon
            v-if="item.result"
            class="mt-0.5 shrink-0"
            :class="item.correct ? 'text-success' : 'text-error'"
            :icon="item.correct ? 'check-circle' : 'close'"
            :size="16"
          />

          <span v-else class="mt-0.5 size-4 shrink-0 rounded-full border-2 border-on-surface-variant/50" />

          <div class="flex flex-col gap-0.5">
            <span class="font-medium text-on-surface">{{ item.stem }}</span>

            <span class="text-xs text-on-surface-variant">
              <template v-if="item.correct">Correct — {{ item.solution }}</template>
              <template v-else-if="item.result">You chose {{ item.picked || '—' }} · answer: {{ item.solution }}</template>
              <template v-else>Skipped — answer: {{ item.solution }}</template>
            </span>
          </div>
        </li>
      </ul>

      <div class="mt-1 flex items-center gap-2">
        <button
          v-if="placement && verdictLevel"
          class="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary transition-colors"
          type="button"
          @click="apply"
        >
          <AppIcon icon="tune" :size="16" />
          Apply {{ verdict?.label }} to filter
        </button>

        <button
          class="inline-flex items-center gap-2 rounded-md border border-divider px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-variant"
          title="Try again"
          type="button"
          @click="onStart"
        >
          <AppIcon icon="restart" :size="16" />
          Try again
        </button>
      </div>
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

        <span
          class="skillz-badge ml-auto inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold uppercase tracking-wide"
          :style="currentLevelMeta ? { '--level-color': currentLevelMeta.color } : undefined"
          :title="currentLevelMeta ? `${currentLevelMeta.label} level` : undefined"
        >
          SKILLZ
          <AppIcon v-if="currentLevelMeta" :icon="currentLevelMeta.icon" :size="14" />
        </span>
      </div>

      <Question.Root
        v-for="slate in deck"
        v-show="slate.id === currentId"
        :key="`${run}-${slate.id}`"
        v-slot="{ submit, isSubmitted, hasSelection, result }"
        :correct-answer="slate.correctAnswers"
        :mode="slate.mode"
        :model-value="answered.get(slate.id)"
        @submit="onAnswer(slate.id, $event)"
        @update:model-value="answered.set(slate.id, $event)"
      >
        <div class="mb-3">
          <Question.Stem class="block font-medium text-on-surface">
            {{ slate.stem }}
          </Question.Stem>

          <p v-if="slate.hint" class="mt-1 text-sm text-on-surface-variant opacity-80">
            <span
              class="rounded align-middle transition-colors"
              :class="revealed.has(slate.id) ? '' : 'cursor-pointer select-none bg-on-surface-variant/25 text-transparent hover:bg-on-surface-variant/35'"
              :role="revealed.has(slate.id) ? undefined : 'button'"
              :tabindex="revealed.has(slate.id) ? undefined : 0"
              :title="revealed.has(slate.id) ? undefined : 'Reveal hint'"
              @click="reveal(slate.id)"
              @keydown.enter="reveal(slate.id)"
              @keydown.space.prevent="reveal(slate.id)"
            >{{ slate.hint }}</span>
          </p>
        </div>

        <div class="flex flex-col gap-2">
          <Question.Option
            v-for="option in slate.options"
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
                  slate.mode === 'multiple' ? 'rounded-sm' : 'rounded-full',
                  isSelected
                    ? (slate.mode === 'multiple' ? 'border-primary bg-primary text-on-primary' : 'border-primary')
                    : 'border-on-surface-variant',
                ]"
              >
                <AppIcon
                  v-if="slate.mode === 'multiple' && isSelected"
                  icon="check"
                  :size="12"
                />

                <span
                  v-else-if="slate.mode !== 'multiple' && isSelected"
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
          <span v-html="renderInline(slate.feedback ?? '')" />
        </Question.Feedback>

        <div class="mt-4 flex items-center gap-2">
          <button
            aria-label="Restart quiz"
            class="inline-flex size-9 items-center justify-center rounded-md border border-divider text-on-surface-variant transition-colors hover:bg-surface-variant"
            title="Restart quiz"
            type="button"
            @click="begin"
          >
            <AppIcon icon="restart" :size="16" />
          </button>

          <button
            aria-label="Previous question"
            class="inline-flex size-9 items-center justify-center rounded-md border border-divider text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-40"
            :disabled="index === 0"
            title="Back"
            type="button"
            @click="onPrev"
          >
            <AppIcon icon="left" :size="16" />
          </button>

          <!-- Stepper: jump to any question, including skipped ones -->
          <div class="flex flex-1 flex-wrap items-center justify-center gap-1.5">
            <button
              v-for="(item, i) in deck"
              :key="item.id"
              :aria-current="item.id === currentId ? 'step' : undefined"
              :aria-label="`Question ${i + 1}${results.has(item.id) ? ', answered' : ', not answered'}`"
              class="size-2.5 rounded-full transition-colors"
              :class="item.id === currentId
                ? 'bg-primary'
                : results.has(item.id)
                  ? 'bg-on-surface-variant'
                  : 'bg-on-surface-variant/25 hover:bg-on-surface-variant/50'"
              type="button"
              @click="go(i)"
            />
          </div>

          <template v-if="!isSubmitted">
            <button
              v-if="!isLast"
              aria-label="Skip question"
              class="inline-flex size-9 items-center justify-center rounded-md border border-divider text-on-surface transition-colors hover:bg-surface-variant"
              title="Skip"
              type="button"
              @click="onSkip"
            >
              <AppIcon icon="right" :size="16" />
            </button>

            <button
              v-else
              class="rounded-md border border-divider px-3 py-1.5 text-sm text-on-surface transition-colors hover:bg-surface-variant"
              type="button"
              @click="onSkip"
            >
              Finish
            </button>

            <button
              class="rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary disabled:opacity-50"
              :disabled="!hasSelection"
              @click="submit"
            >
              Check answer
            </button>
          </template>

          <button
            v-else
            class="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-on-primary"
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

<style scoped>
  .skillz-badge {
    background: color-mix(in srgb, var(--level-color, var(--v0-primary)) 15%, transparent);
    color: var(--level-color, var(--v0-primary));
  }
</style>
