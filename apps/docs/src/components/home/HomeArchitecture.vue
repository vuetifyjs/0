<script setup lang="ts">
  // Framework
  import { Selection, Tabs, useTheme } from '@vuetify/v0'

  // Composables
  import { useHighlightCode } from '@/composables/useHighlightCode'

  // Utilities
  import { computed, shallowRef } from 'vue'

  const theme = useTheme()
  const activeTab = shallowRef('composable')

  const items = shallowRef([
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C' },
  ])

  const selected = shallowRef<number[]>([])

  const codeSnippets: Record<string, string> = {
    composable: `<script setup lang="ts">
  import { createSelection } from '@vuetify/v0'
  import { ref } from 'vue'

  const items = ref([
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C' },
  ])

  const selection = createSelection({
    items,
    multiple: true,
  })

  // Pure reactive state — no components needed
  selection.select(1)
  selection.selected(1) // true
<\/script>`,

    component: `<script setup lang="ts">
  import { Selection } from '@vuetify/v0'
  import { ref } from 'vue'

  const items = [
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C' },
  ]

  const selected = ref([])
<\/script>

<template>
  <Selection.Root v-model="selected" multiple>
    <Selection.Item
      v-for="item in items"
      :key="item.id"
      v-slot="{ isSelected, toggle }"
      :value="item.id"
    >
      <button
        :class="isSelected && 'selected'"
        @click="toggle"
      >
        {{ item.label }}
      </button>
    </Selection.Item>
  </Selection.Root>
</template>`,
  }

  const currentCode = computed(() => codeSnippets[activeTab.value] ?? '')
  const highlighter = useHighlightCode(currentCode, { idle: true })
</script>

<template>
  <section class="home-architecture py-20 md:py-28">
    <div class="text-center mb-12">
      <p class="section-overline mb-3">COMPOSABLE ARCHITECTURE</p>

      <h2 class="text-2xl md:text-4xl font-bold tracking-tight mb-4">
        Logic without components. Components without opinions.
      </h2>

      <p class="opacity-60 max-w-[640px] mx-auto leading-relaxed">
        Use createSelection as a composable, or Selection as a compound component. Same logic, your choice.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <!-- Code panel -->
      <div class="demo-code rounded-xl border overflow-hidden bg-surface flex flex-col h-[510px]">
        <Tabs.Root v-model="activeTab">
          <Tabs.List class="px-4 py-2 bg-surface-tint border-b flex items-center gap-2" label="Code examples">
            <Tabs.Item
              as="button"
              class="px-3 py-1 rounded-md text-xs font-medium transition-colors text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-variant data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:opacity-100 data-[selected]:hover:bg-primary"
              value="composable"
            >
              Composable
            </Tabs.Item>

            <Tabs.Item
              as="button"
              class="px-3 py-1 rounded-md text-xs font-medium transition-colors text-on-surface opacity-60 hover:opacity-100 hover:bg-surface-variant data-[selected]:bg-primary data-[selected]:text-on-primary data-[selected]:opacity-100 data-[selected]:hover:bg-primary"
              value="component"
            >
              Component
            </Tabs.Item>
          </Tabs.List>
        </Tabs.Root>

        <div
          v-if="highlighter.highlightedCode.value"
          class="flex-1 overflow-y-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:md:text-sm [&_pre]:overflow-x-auto [&_pre]:leading-relaxed [&_pre]:m-0"
          :data-theme="theme.isDark.value ? 'dark' : 'light'"
          v-html="highlighter.highlightedCode.value"
        />
        <pre v-else class="flex-1 p-4 text-xs md:text-sm overflow-x-auto leading-relaxed m-0"><code>{{ currentCode }}</code></pre>
      </div>

      <!-- Live demo -->
      <div class="relative px-6 py-8 rounded-xl border bg-surface flex flex-col justify-center overflow-hidden">
        <AppDotGrid :coverage="60" :density="18" />

        <p class="relative text-xs font-medium uppercase tracking-wide opacity-50 mb-6">Live Preview</p>

        <Selection.Root v-model="selected" multiple>
          <div class="relative flex flex-wrap justify-center gap-3 mb-6">
            <Selection.Item
              v-for="item in items"
              :key="item.id"
              v-slot="{ isSelected, toggle }"
              :value="item.id"
            >
              <button
                :aria-pressed="isSelected"
                class="demo-btn px-5 py-2.5 rounded-lg border font-medium transition-all whitespace-nowrap"
                :class="isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface hover:bg-surface-tint'"
                @click="toggle"
              >
                {{ item.label }}
              </button>
            </Selection.Item>
          </div>

          <div class="relative text-sm opacity-60">
            Selected: <span class="font-mono text-on-surface">{{ selected.length > 0 ? selected.join(', ') : 'none' }}</span>
          </div>
        </Selection.Root>

        <div class="relative mt-8 pt-6 border-t">
          <router-link
            class="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
            to="/components/providers/selection"
          >
            View Selection docs
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .home-architecture :deep(pre.shiki) {
    border: none;
  }
</style>
