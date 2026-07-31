<script setup lang="ts">
  import { mdiArrowLeft } from '@mdi/js'

  // Framework
  import { Button, Toggle } from '@vuetify/v0'

  // Components
  import StepBar from '@/components/app/StepBar.vue'

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

        <!-- Selection is an accent rail down the line item rather than a card outline: the
             panel already owns the border, so the row only needs to light up inside it. -->
        <div class="divide-y divide-divider">
          <Toggle.Root
            v-for="question in category.questions"
            :key="question.id"
            :aria-label="question.title"
            class="w-full flex items-start gap-3 pl-3 pr-4 py-3 text-left border-l-2 transition-colors duration-150"
            :class="store.isPluginSelected(question.feature)
              ? 'border-primary bg-primary/8'
              : 'border-transparent hover:bg-surface-variant/50'"
            :model-value="store.isPluginSelected(question.feature)"
            @update:model-value="store.togglePlugin(question.feature)"
          >
            <span
              class="pick-mark w-5 h-5 mt-0.5"
              :class="store.isPluginSelected(question.feature) ? 'pick-mark-on' : 'pick-mark-off'"
            >
              <svg v-if="store.isPluginSelected(question.feature)" class="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
            </span>

            <span class="min-w-0 flex-1">
              <span class="flex items-baseline gap-2 flex-wrap">
                <span class="t-section">{{ question.title }}</span>
                <span class="font-mono text-[0.6875rem] text-on-surface-variant/80">{{ question.feature }}</span>
              </span>

              <span class="block t-meta text-on-surface-variant mt-0.5">{{ question.description }}</span>
            </span>
          </Toggle.Root>
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
