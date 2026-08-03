<script setup lang="ts">
  import { mdiArrowLeft } from '@mdi/js'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  // Components
  import StepBar from '@/components/app/StepBar.vue'
  import PluginInfo from '@/components/PluginInfo.vue'

  import { getPluginById } from '@/data/plugins'
  import { getCategories } from '@/data/questions'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'
  import { useRouter } from 'vue-router'

  const store = useBuilderStore()
  const router = useRouter()

  // Each category is a panel of the machine, opened up: the line items live inside it
  // rather than floating on the page, so the grouping is a container, not a heading.
  const categories = toRef(() => getCategories().map(category => ({
    ...category,
    picked: category.questions.filter(q => store.isPluginSelected(q.feature)).length,
  })))

  function meta (feature: string) {
    return getPluginById(feature)
  }

  function onContinue () {
    router.push('/builder/configure')
  }

  function onBack () {
    router.push('/')
  }
</script>

<template>
  <div class="max-w-4xl mx-auto px-6 pt-5 sm:pt-6 pb-24">
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

    <div class="flex flex-col gap-4">
      <section v-for="category in categories" :key="category.id" class="panel overflow-hidden">
        <div class="flex items-baseline justify-between gap-3 px-4 py-3 border-b border-divider bg-surface-variant/40">
          <div class="min-w-0">
            <h3 class="t-section">{{ category.title }}</h3>
            <p class="t-meta text-on-surface-variant">{{ category.description }}</p>
          </div>

          <p class="t-index flex-shrink-0" :class="category.picked > 0 ? 'text-primary' : 'text-on-surface-variant/60'">
            {{ category.picked }}/{{ category.questions.length }}
          </p>
        </div>

        <!-- Portrait cards, not rows: playing-card proportions read as a hand of choices,
             so the panel spends its body on columns rather than a single divided list. -->
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 p-3">
          <!-- The info affordance sits outside the toggle: a button inside a button is
               invalid, and nesting it would make the whole card announce as "about". -->
          <div
            v-for="question in category.questions"
            :key="question.id"
            class="group relative"
          >
            <Toggle.Root
              :aria-label="question.title"
              class="pick aspect-[5/7] w-full p-3.5 flex flex-col items-start gap-2"
              :class="store.isPluginSelected(question.feature) ? 'pick-on' : 'pick-off'"
              :model-value="store.isPluginSelected(question.feature)"
              @update:model-value="store.togglePlugin(question.feature)"
            >
              <span
                class="pick-mark w-5 h-5"
                :class="store.isPluginSelected(question.feature) ? 'pick-mark-on' : 'pick-mark-off'"
              >
                <svg v-if="store.isPluginSelected(question.feature)" class="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                </svg>
              </span>

              <span class="t-section leading-snug">{{ question.title }}</span>

              <span class="flex-1" />

              <span class="flex flex-col items-start gap-1.5 w-full min-w-0">
                <span class="font-mono text-[0.6875rem] text-on-surface-variant/80 truncate w-full">{{ question.feature }}</span>
                <span v-if="meta(question.feature)?.hasConfig" class="chip-quiet flex-shrink-0">config</span>
              </span>
            </Toggle.Root>

            <PluginInfo
              :id="question.feature"
              :description="question.description"
              :docs="meta(question.feature)?.docs"
              :title="question.title"
            />
          </div>
        </div>
      </section>
    </div>
  </div>

  <StepBar>
    <!-- The noun drops below sm so the count and the action stay on one row. Spelled out
         twice rather than wrapping the noun in a span: Vue condenses the leading space
         inside the span away, and "5plugins selected" is worse than a duplicated string. -->
    <p class="t-index text-on-surface-variant">
      <span class="sm:hidden">{{ store.selectedPlugins.size }} selected</span>

      <span class="hidden sm:inline">
        {{ store.selectedPlugins.size }} {{ store.selectedPlugins.size === 1 ? 'plugin' : 'plugins' }} selected
      </span>
    </p>

    <Button.Root
      class="btn-primary"
      :disabled="store.selectedPlugins.size === 0"
      @click="onContinue"
    >
      Continue
    </Button.Root>
  </StepBar>
</template>
