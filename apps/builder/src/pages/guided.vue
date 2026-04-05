<script setup lang="ts">
  import { mdiArrowLeft, mdiArrowRight, mdiCellphone, mdiChartBar, mdiCheckCircle, mdiCompass, mdiEyedropper, mdiMonitor, mdiNewspaperVariant, mdiPuzzle } from '@mdi/js'

  // Framework
  import { useHotkey } from '@vuetify/v0'

  // Utilities
  import { computed, shallowRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { Intent } from '@/data/types'

  import { CATEGORY_ICONS } from '@/data/features'
  import { getQuestions } from '@/data/questions'
  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const selectedFeatures = computed(() => store.catalog.filter(f => store.isSelected(f.id)))
  const autoFeatures = computed(() => store.catalog.filter(f => store.resolved.autoIncluded.includes(f.id)))
  const total = computed(() => selectedFeatures.value.length + autoFeatures.value.length)

  const selectedByCategory = computed(() => {
    const map = new Map<string, typeof selectedFeatures.value>()
    for (const f of selectedFeatures.value) {
      const list = map.get(f.category) ?? []
      list.push(f)
      map.set(f.category, list)
    }
    return map
  })

  const intents: Array<{ id: Intent, title: string, description: string, icon: string }> = [
    { id: 'spa', title: 'SPA', description: 'Single-page application with routing and state', icon: mdiMonitor },
    { id: 'component-library', title: 'Component Library', description: 'Reusable components for your team', icon: mdiPuzzle },
    { id: 'design-system', title: 'Design System', description: 'Full design system with tokens and patterns', icon: mdiEyedropper },
    { id: 'admin-dashboard', title: 'Admin Dashboard', description: 'Data-heavy internal tools and panels', icon: mdiChartBar },
    { id: 'content-site', title: 'Content Site', description: 'Blog, docs, or marketing pages', icon: mdiNewspaperVariant },
    { id: 'mobile-first', title: 'Mobile-First', description: 'Touch-optimized responsive application', icon: mdiCellphone },
  ]

  // Question flow
  const questions = computed(() => {
    const intentId = store.intent.selectedId as string | undefined
    if (!intentId) return []
    return getQuestions(intentId as Intent)
  })

  const answers = shallowRef<Record<string, boolean>>({})
  const currentQuestionIndex = shallowRef(0)
  const started = shallowRef(false)

  const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
  const allAnswered = computed(() => started.value && currentQuestionIndex.value >= questions.value.length)

  // Phase helpers
  const phase = computed(() => {
    if (!store.intent.selectedId || !started.value) return 'intent'
    if (!allAnswered.value) return 'questions'
    return 'review'
  })

  // Sync question state to store for AppBar breadcrumbs
  watch([currentQuestionIndex, questions, () => store.intent.selectedId, started], () => {
    store.questionCount = questions.value.length
    if (phase.value === 'intent') {
      store.questionIndex = -1
    } else if (allAnswered.value) {
      store.questionIndex = questions.value.length
    } else {
      store.questionIndex = currentQuestionIndex.value
    }
  }, { immediate: true })

  function onAnswer (yes: boolean) {
    const q = currentQuestion.value
    if (!q) return

    answers.value = { ...answers.value, [q.id]: yes }

    if (yes) {
      store.select(q.feature)
    }

    currentQuestionIndex.value++
  }

  function onIntent (id: Intent) {
    store.setIntent(id)
    // Reset question state when intent changes
    currentQuestionIndex.value = 0
    answers.value = {}
    started.value = true
  }

  function onBack () {
    if (allAnswered.value) {
      // Go back to last question
      currentQuestionIndex.value = questions.value.length - 1
    } else if (currentQuestionIndex.value > 0) {
      // Go back to previous question and undo answer
      currentQuestionIndex.value--
      const q = questions.value[currentQuestionIndex.value]
      if (q && answers.value[q.id]) {
        store.deselect(q.feature)
      }
      const next = { ...answers.value }
      delete next[q.id]
      answers.value = next
    } else if (started.value) {
      // Go back to intent selection
      started.value = false
    } else {
      router.push('/')
    }
  }

  function onSwitchToFree () {
    store.mode.select('free')
    router.push('/free')
  }

  // Keyboard navigation
  useHotkey('arrowright', () => {
    if (phase.value === 'intent' && store.intent.selectedId) {
      // Move to first question (intent auto-advances, but just in case)
    }
  }, { preventDefault: false })
  useHotkey('arrowleft', () => {
    onBack()
  }, { preventDefault: false })
</script>

<template>
  <div class="py-12">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <button class="text-sm text-on-surface-variant hover:text-on-surface transition-colors" @click="onBack">
        <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
        Back
      </button>
      <button class="text-sm text-primary hover:underline" @click="onSwitchToFree">
        Switch to Free Pick
      </button>
    </div>

    <!-- Phase indicator -->
    <div class="flex items-center gap-0 mb-8">
      <template v-for="(step, index) in ['Intent', 'Questions', 'Review']" :key="step">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          :class="[
            index < ['intent', 'questions', 'review'].indexOf(phase)
              ? 'bg-primary text-on-primary'
              : index === ['intent', 'questions', 'review'].indexOf(phase)
                ? 'bg-primary text-on-primary ring-4 ring-primary/20'
                : 'bg-surface-variant text-on-surface-variant',
          ]"
        >
          <svg v-if="index < ['intent', 'questions', 'review'].indexOf(phase)" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
          <svg v-else class="w-4 h-4" viewBox="0 0 24 24">
            <path :d="index === 0 ? mdiCompass : index === 2 ? mdiCheckCircle : mdiArrowRight" fill="currentColor" />
          </svg>
        </div>
        <div
          v-if="index < 2"
          class="h-0.5 flex-1 transition-colors"
          :class="index < ['intent', 'questions', 'review'].indexOf(phase) ? 'bg-primary' : 'bg-divider'"
        />
      </template>
    </div>

    <!-- Intent step -->
    <template v-if="phase === 'intent'">
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step 1 of 3
      </p>
      <h2 class="text-xl font-bold mb-2">What are you building?</h2>
      <p class="text-on-surface-variant mb-6">Pick a project type and we'll seed the right features for you.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <IntentCard
          v-for="item in intents"
          :key="item.id"
          :active="store.intent.selectedId === item.id"
          :description="item.description"
          :icon="item.icon"
          :title="item.title"
          @click="onIntent(item.id)"
        />
      </div>

      <div
        v-if="store.intent.selectedId"
        class="bg-primary/5 text-primary text-sm p-3 rounded-lg mt-4 flex items-center justify-between"
      >
        <span>Great choice! We've pre-selected {{ store.selectedCount }} features for you.</span>
        <button
          class="px-4 py-1.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          @click="started = true"
        >
          Continue
        </button>
      </div>
    </template>

    <!-- Question step -->
    <template v-else-if="!allAnswered">
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
      </p>
      <h2 class="text-xl font-bold mb-4">{{ currentQuestion.question }}</h2>
      <p class="text-on-surface-variant mb-8">{{ currentQuestion.description }}</p>

      <div class="grid grid-cols-2 gap-4">
        <button
          class="p-6 rounded-lg border border-divider bg-surface hover:border-primary hover:shadow-md transition-all text-left"
          @click="onAnswer(true)"
        >
          <svg class="w-6 h-6 text-primary mb-3" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
          </svg>
          <h3 class="font-semibold text-on-surface mb-1">Yes, add this</h3>
          <p class="text-sm text-on-surface-variant">Include {{ currentQuestion.feature }} in your framework</p>
        </button>

        <button
          class="p-6 rounded-lg border border-divider bg-surface hover:border-on-surface-variant hover:shadow-md transition-all text-left"
          @click="onAnswer(false)"
        >
          <svg class="w-6 h-6 text-on-surface-variant mb-3" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor" />
          </svg>
          <h3 class="font-semibold text-on-surface mb-1">No, skip</h3>
          <p class="text-sm text-on-surface-variant">I don't need this right now</p>
        </button>
      </div>

      <!-- Progress dots -->
      <div class="flex justify-center gap-2 mt-8">
        <div
          v-for="(q, i) in questions"
          :key="q.id"
          class="w-2 h-2 rounded-full transition-colors"
          :class="i < currentQuestionIndex ? 'bg-primary' : i === currentQuestionIndex ? 'bg-primary ring-2 ring-primary/30' : 'bg-divider'"
        />
      </div>
    </template>

    <!-- Review step -->
    <template v-else>
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step 3 of 3
      </p>
      <h2 class="text-xl font-bold mb-2 flex items-center gap-2">
        <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        Your Framework
      </h2>
      <p class="text-on-surface-variant mb-6">
        {{ total }} features ready to go.
      </p>

      <!-- Stats grid -->
      <div class="grid grid-cols-3 gap-4 mb-8">
        <div class="bg-surface rounded-lg p-4 text-center border border-divider">
          <div class="text-2xl font-bold text-primary">{{ selectedFeatures.length }}</div>
          <div class="text-xs text-on-surface-variant mt-1">Selected</div>
        </div>
        <div class="bg-surface rounded-lg p-4 text-center border border-divider">
          <div class="text-2xl font-bold text-accent">{{ autoFeatures.length }}</div>
          <div class="text-xs text-on-surface-variant mt-1">Auto-included</div>
        </div>
        <div class="bg-surface rounded-lg p-4 text-center border border-divider">
          <div class="text-2xl font-bold text-on-surface">{{ total }}</div>
          <div class="text-xs text-on-surface-variant mt-1">Total</div>
        </div>
      </div>

      <!-- Selected features by category -->
      <div v-if="selectedFeatures.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 pl-3 border-l-2 border-primary">You selected</h3>
        <div class="flex flex-col gap-4">
          <div v-for="[category, features] in selectedByCategory" :key="category">
            <div class="flex items-center gap-2 mb-2">
              <svg v-if="CATEGORY_ICONS[category]" class="w-4 h-4 text-on-surface-variant" viewBox="0 0 24 24">
                <path :d="CATEGORY_ICONS[category]" fill="currentColor" />
              </svg>
              <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">{{ category }}</span>
            </div>
            <div class="flex flex-col gap-1.5">
              <div
                v-for="feature in features"
                :key="feature.id"
                class="flex items-center justify-between py-2 px-3 rounded-lg border border-primary/30 bg-surface"
              >
                <div>
                  <span class="font-medium text-on-surface text-sm">{{ feature.name }}</span>
                  <span class="text-xs text-on-surface-variant ml-2">{{ feature.summary }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-included dependencies -->
      <div v-if="autoFeatures.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 pl-3 border-l-2 border-accent">Auto-included dependencies</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="feature in autoFeatures"
            :key="feature.id"
            class="text-xs py-1 px-2.5 rounded-full border border-dashed border-divider text-on-surface-variant bg-surface/50"
          >
            {{ feature.name }}
          </span>
        </div>
      </div>

      <!-- Warnings -->
      <div v-if="store.resolved.warnings.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold text-warning uppercase tracking-wide mb-3">Warnings</h3>
        <div
          v-for="warning in store.resolved.warnings"
          :key="warning.featureId"
          class="p-3 rounded-lg border border-warning/30 bg-warning/5 text-sm text-on-surface-variant"
        >
          {{ warning.message }}
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="selectedFeatures.length === 0" class="text-center py-12">
        <p class="text-on-surface-variant">No features selected. Go back and pick some!</p>
      </div>

      <!-- Open in Playground -->
      <button
        class="w-full px-4 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        :class="{ 'opacity-50 cursor-not-allowed': selectedFeatures.length === 0 }"
        :disabled="selectedFeatures.length === 0"
        @click="store.openInPlayground()"
      >
        Try in Playground →
      </button>
    </template>

    <!-- Navigation -->
    <div class="flex justify-between mt-12">
      <button
        class="px-4 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        @click="onBack"
      >
        Back
      </button>
    </div>
  </div>
</template>
