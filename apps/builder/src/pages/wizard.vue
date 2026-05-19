<script setup lang="ts">
  import { mdiArrowLeft, mdiCheckCircle } from '@mdi/js'

  import { getCategories } from '@/data/questions'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useBuilderStore()
  const router = useRouter()

  const phase = shallowRef<'plugins' | 'review'>('plugins')
  const categories = toRef(() => getCategories('component-library'))

  function onContinue () {
    phase.value = 'review'
  }

  function onBack () {
    if (phase.value === 'review') {
      phase.value = 'plugins'
      return
    }
    router.push('/')
  }
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-12">
    <button
      class="text-sm text-on-surface-variant hover:text-on-surface mb-6 inline-flex items-center gap-1"
      @click="onBack"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      Back
    </button>

    <template v-if="phase === 'plugins'">
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step 1 of 2
      </p>

      <h2 class="text-2xl font-bold mb-2">Configure plugins</h2>

      <p class="text-on-surface-variant mb-8">
        Plugins are installed at app startup via <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">app.use()</code>.
        Toggle the ones your library needs.
      </p>

      <div class="flex flex-col gap-8">
        <div v-for="category in categories" :key="category.id">
          <div class="mb-3">
            <h3 class="text-sm font-semibold uppercase tracking-wide">{{ category.title }}</h3>
            <p class="text-xs text-on-surface-variant mt-0.5">{{ category.description }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              v-for="question in category.questions"
              :key="question.id"
              class="p-4 rounded-lg border text-left transition-all"
              :class="store.isSelected(question.feature)
                ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                : 'border-divider bg-surface hover:border-on-surface-variant/40'"
              :data-selected="store.isSelected(question.feature) || undefined"
              @click="store.toggle(question.feature)"
            >
              <div class="flex items-start justify-between gap-2 mb-2">
                <h4 class="font-semibold text-sm">{{ question.title }}</h4>

                <div
                  class="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors"
                  :class="store.isSelected(question.feature) ? 'bg-primary' : 'border border-divider'"
                >
                  <svg v-if="store.isSelected(question.feature)" class="w-3.5 h-3.5 text-on-primary" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                  </svg>
                </div>
              </div>

              <p class="text-xs text-on-surface-variant leading-relaxed">{{ question.description }}</p>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-between">
        <span class="text-sm text-on-surface-variant">
          {{ store.selected.size }} {{ store.selected.size === 1 ? 'plugin' : 'plugins' }} selected
        </span>

        <button
          class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="store.selected.size === 0"
          @click="onContinue"
        >
          Continue to Review
        </button>
      </div>
    </template>

    <template v-else>
      <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
        Step 2 of 2
      </p>

      <h2 class="text-2xl font-bold mb-2 flex items-center gap-2">
        <svg class="w-6 h-6 text-primary" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        Your framework
      </h2>

      <p class="text-on-surface-variant mb-8">
        {{ store.resolved.selected.length + store.resolved.autoIncluded.length }} features total —
        {{ store.resolved.selected.length }} selected,
        {{ store.resolved.autoIncluded.length }} auto-included.
      </p>

      <section v-if="store.resolved.selected.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 pl-3 border-l-2 border-primary">
          Selected
        </h3>

        <ul class="flex flex-col gap-1.5">
          <li
            v-for="id in store.resolved.selected"
            :key="id"
            class="bg-surface rounded-lg p-3 border font-mono text-sm"
          >
            {{ id }}
          </li>
        </ul>
      </section>

      <section v-if="store.resolved.autoIncluded.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 pl-3 border-l-2 border-accent">
          Auto-included dependencies
        </h3>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="id in store.resolved.autoIncluded"
            :key="id"
            class="text-xs font-mono px-2 py-1 rounded bg-surface-variant"
            :title="store.resolved.reasons[id]"
          >
            {{ id }}
          </span>
        </div>
      </section>

      <section v-if="store.resolved.warnings.length > 0" class="mb-8">
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 pl-3 border-l-2 border-error">
          Warnings
        </h3>

        <ul class="flex flex-col gap-1.5">
          <li
            v-for="warning in store.resolved.warnings"
            :key="warning.featureId"
            class="text-sm text-on-surface-variant"
          >
            <strong>{{ warning.featureId }}:</strong> {{ warning.message }}
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>
