<script lang="ts" setup>
  import { Selection } from '@vuetify/v0'
  import { computed, onMounted, ref } from 'vue'
  import { usePlayground } from '@/composables/playground'
  import { useHighlightCode } from '@/composables/useHighlightCode'

  const items = ref([
    { id: 1, label: 'Option A' },
    { id: 2, label: 'Option B' },
    { id: 3, label: 'Option C' },
  ])

  const selected = ref<number[]>([])

  const code = `<script setup lang="ts">
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

    <p>Selected: {{ selected }}</p>
  </Selection.Root>
</template>`

  const { highlightedCode, highlight } = useHighlightCode(code, { immediate: false })

  onMounted(() => {
    // Defer syntax highlighting to idle time to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => highlight(), { timeout: 2000 })
    } else {
      setTimeout(() => highlight(), 100)
    }
  })

  const playgroundUrl = computed(() => usePlayground(code))
</script>

<template>
  <section class="home-demo py-16 md:py-20">
    <h2 class="text-2xl md:text-3xl font-bold text-center mb-4">
      Simple by Design
    </h2>

    <p class="opacity-60 text-center mb-12 max-w-[600px] mx-auto">
      Primitives that handle the hard parts—state, accessibility, keyboard navigation—while you control the styling.
    </p>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch h-[500px] md:h-[350px]">
      <!-- Code -->
      <div class="demo-code rounded-xl border overflow-hidden bg-surface flex flex-col">
        <div class="px-4 py-2 bg-surface-tint text-xs font-medium border-b flex items-center justify-between">
          <span>Selection.vue</span>
          <router-link
            class="text-primary hover:underline"
            to="/components/providers/selection"
          >
            View docs →
          </router-link>
        </div>
        <div
          v-if="highlightedCode"
          class="flex-1 overflow-y-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:md:text-sm [&_pre]:overflow-x-auto [&_pre]:leading-relaxed [&_pre]:m-0"

          v-html="highlightedCode"
        />
        <pre v-else class="p-4 text-xs md:text-sm overflow-x-auto leading-relaxed m-0"><code>{{ code }}</code></pre>
      </div>

      <!-- Live Demo -->
      <div class="demo-preview p-4 md:p-8 rounded-xl border bg-surface flex flex-col">
        <div class="text-center md:text-end mb-8 lg:mb-0">
          <a
            class="text-xs font-medium text-primary hover:underline inline-flex gap-1"
            :href="playgroundUrl"
            rel="noopener noreferrer"
            target="_blank"
          >
            <AppIcon icon="vuetify-play" :size="14" />
            Open in Vuetify Play
          </a>
        </div>

        <div class="flex-1 flex flex-col justify-center">
          <Selection.Root v-model="selected" multiple>
            <div class="flex gap-3 mb-6">
              <Selection.Item
                v-for="item in items"
                :key="item.id"
                v-slot="{ isSelected, toggle }"
                :value="item.id"
              >
                <button
                  class="demo-btn px-5 py-2.5 rounded-lg border font-medium transition-all flex-1"
                  :class="isSelected ? 'bg-primary text-on-primary border-primary' : 'bg-surface hover:bg-surface-tint'"
                  @click="toggle"
                >
                  {{ item.label }}
                </button>
              </Selection.Item>
            </div>

            <div class="text-sm opacity-60">
              Selected: <span class="font-mono text-on-surface">{{ selected.length > 0 ? selected.join(', ') : 'none' }}</span>
            </div>
          </Selection.Root>
        </div>
      </div>
    </div>
  </section>
</template>
