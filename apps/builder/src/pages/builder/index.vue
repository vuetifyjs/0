<script setup lang="ts">
  import { mdiArrowLeft } from '@mdi/js'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  import { getCategories } from '@/data/questions'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useBuilderStore()
  const router = useRouter()

  const categories = toRef(() => getCategories())

  function onContinue () {
    router.push('/builder/configure')
  }

  function onBack () {
    router.push('/')
  }
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 py-10 sm:py-12">
    <Button.Root class="btn-quiet mb-8" @click="onBack">
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <Button.Content>Back</Button.Content>
    </Button.Root>

    <header class="mb-10">
      <p class="t-eyebrow text-primary mb-3">Step 1 · Select</p>

      <h2 class="t-title mb-3">Choose your plugins</h2>

      <p class="t-body text-on-surface-variant max-w-2xl">
        Plugins are installed at app startup via <code class="code-chip">app.use()</code>.
        Pick the ones your library needs — you will configure each one next.
      </p>
    </header>

    <div class="flex flex-col gap-10">
      <section v-for="category in categories" :key="category.id">
        <div class="flex items-baseline gap-3 mb-4 pb-2.5 border-b border-divider">
          <h3 class="t-eyebrow text-on-surface">{{ category.title }}</h3>
          <p class="t-meta text-on-surface-variant">{{ category.description }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Toggle.Root
            v-for="question in category.questions"
            :key="question.id"
            :aria-label="question.title"
            class="pick p-4"
            :class="store.isPluginSelected(question.feature) ? 'pick-on' : 'pick-off'"
            :model-value="store.isPluginSelected(question.feature)"
            @update:model-value="store.togglePlugin(question.feature)"
          >
            <div class="flex items-start justify-between gap-2.5 mb-2">
              <h4 class="t-section">{{ question.title }}</h4>

              <span
                class="pick-mark w-5 h-5"
                :class="store.isPluginSelected(question.feature) ? 'pick-mark-on' : 'pick-mark-off'"
              >
                <svg v-if="store.isPluginSelected(question.feature)" class="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                </svg>
              </span>
            </div>

            <p class="t-meta text-on-surface-variant">{{ question.description }}</p>
          </Toggle.Root>
        </div>
      </section>
    </div>

    <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6">
      <p class="t-index text-on-surface-variant">
        {{ store.selectedPlugins.size }} {{ store.selectedPlugins.size === 1 ? 'plugin' : 'plugins' }} selected
      </p>

      <Button.Root
        class="btn-primary"
        :disabled="store.selectedPlugins.size === 0"
        @click="onContinue"
      >
        Continue
      </Button.Root>
    </div>
  </div>
</template>
