<script setup lang="ts">
  import { mdiArrowLeft } from '@mdi/js'

  import { getCategories } from '@/data/questions'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useBuilderStore()
  const router = useRouter()

  const categories = toRef(() => getCategories('component-library'))

  function onContinue () {
    router.push('/builder/configure')
  }

  function onBack () {
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

    <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
      Step 1
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
            :class="store.isPluginSelected(question.feature)
              ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
              : 'border-divider bg-surface hover:border-on-surface-variant/40'"
            :data-selected="store.isPluginSelected(question.feature) || undefined"
            @click="store.togglePlugin(question.feature)"
          >
            <div class="flex items-start justify-between gap-2 mb-2">
              <h4 class="font-semibold text-sm">{{ question.title }}</h4>

              <div
                class="w-5 h-5 rounded flex-shrink-0 flex items-center justify-center transition-colors"
                :class="store.isPluginSelected(question.feature) ? 'bg-primary' : 'border border-divider'"
              >
                <svg v-if="store.isPluginSelected(question.feature)" class="w-3.5 h-3.5 text-on-primary" viewBox="0 0 24 24">
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
        {{ store.selectedPlugins.size }} {{ store.selectedPlugins.size === 1 ? 'plugin' : 'plugins' }} selected
      </span>

      <button
        class="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="store.selectedPlugins.size === 0"
        @click="onContinue"
      >
        Continue
      </button>
    </div>
  </div>
</template>
