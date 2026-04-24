<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Composables
  import { loadIndex, search } from '@/composables/useSearch'

  // Utilities
  import { onMounted, shallowRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { SearchResult } from '@/composables/useSearch'

  const route = useRoute()
  const query = shallowRef('')
  const results = shallowRef<SearchResult[]>([])
  const loading = shallowRef(true)

  const NOISE = new Set(['components', 'composables', 'guide', 'introduction', 'utilities', 'api'])

  function extract (path: string): string {
    return path
      .replace(/^\/|\/$/g, '')
      .split(/[/\-]/)
      .filter(s => s && !NOISE.has(s))
      .join(' ')
  }

  function run () {
    results.value = search(query.value).slice(0, 5)
  }

  onMounted(async () => {
    query.value = extract(route.path)
    await loadIndex()
    loading.value = false
    run()
  })

  watch(query, run)
</script>

<template>
  <section class="flex-1 flex flex-col items-center justify-center text-center py-16 md:py-24 px-4 md:ml-[230px]">
    <div class="text-8xl md:text-9xl font-bold opacity-10 mb-4">
      404
    </div>

    <h1 class="text-3xl md:text-4xl font-bold mb-4">
      Page not found
    </h1>

    <p class="text-lg opacity-60 mb-8">
      <code class="bg-surface-tint px-2 py-1 rounded text-sm">{{ route.path }}</code>
    </p>

    <!-- Chat bubble -->
    <div class="rounded-lg border border-divider bg-surface max-w-lg w-full text-left mb-6 overflow-hidden">
      <div class="flex items-center gap-2 px-4 py-4 border-b border-divider bg-surface-variant-50">
        <AppIcon class="text-primary" icon="create" />
        <span class="text-sm font-medium">Ask AI</span>
      </div>

      <div class="relative px-4 py-4 overflow-hidden">
        <AppDotGrid :coverage="60" :density="18" origin="bottom left" />

        <p class="text-sm text-on-surface-variant mb-3">
          Maybe you searched for...
        </p>

        <div v-if="loading" class="text-sm text-on-surface-variant">
          <div class="flex flex-col gap-2">
            <div v-for="n in 3" :key="n" class="h-4 bg-surface-tint rounded animate-pulse" :style="{ width: `${60 + n * 10}%` }" />
          </div>
        </div>

        <div v-else-if="results.length === 0" class="text-sm text-on-surface-variant">
          No results found. Try a different search.
        </div>

        <div v-else class="flex flex-col">
          <router-link
            v-for="result in results"
            :key="result.id"
            class="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-surface-variant transition-colors no-underline text-on-surface cursor-pointer"
            :to="result.path"
          >
            <span class="flex-1 min-w-0 font-medium truncate">{{ result.title }}</span>
            <span class="text-xs text-on-surface-variant shrink-0">{{ result.category }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <p class="text-sm text-on-surface-variant mb-6">
      or refine your search
    </p>

    <!-- Search input -->
    <div class="flex items-center gap-3 px-4 py-3 rounded-lg border border-divider bg-surface max-w-lg w-full mb-8">
      <AppIcon
        class="text-on-surface-variant shrink-0"
        icon="search"
      />

      <input
        v-model="query"
        class="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-tint"
        placeholder="Refine your search..."
        type="text"
      >
    </div>

    <router-link
      class="px-6 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity"
      to="/"
    >
      Go Home
    </router-link>
  </section>
</template>

<route lang="yaml">
meta:
  layout: fullscreen
</route>
