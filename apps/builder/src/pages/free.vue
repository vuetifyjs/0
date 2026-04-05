<script setup lang="ts">
  import { mdiArrowLeft, mdiMagnify } from '@mdi/js'

  // Utilities
  import { computed, shallowRef } from 'vue'
  import { useRouter } from 'vue-router'

  import { CATEGORY_ICONS } from '@/data/features'
  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const query = shallowRef('')

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return store.catalog

    return store.catalog.filter(f =>
      f.name.toLowerCase().includes(q)
      || f.id.toLowerCase().includes(q)
      || f.summary.toLowerCase().includes(q)
      || f.tags.some(t => t.includes(q)),
    )
  })

  const grouped = computed(() => {
    const groups = new Map<string, typeof filtered.value>()
    for (const feature of filtered.value) {
      const list = groups.get(feature.category) ?? []
      list.push(feature)
      groups.set(feature.category, list)
    }
    return groups
  })

  function onReview () {
    router.push('/review')
  }
</script>

<template>
  <div class="py-12">
    <div class="flex items-center justify-between mb-8">
      <button class="text-sm text-on-surface-variant hover:text-on-surface transition-colors" @click="router.push('/')">
        <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
        Back
      </button>
      <button
        class="text-sm bg-primary text-on-primary px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        :class="{ 'opacity-50 cursor-not-allowed': store.selectedCount === 0 }"
        :disabled="store.selectedCount === 0"
        @click="onReview"
      >
        Review ({{ store.selectedCount }})
      </button>
    </div>

    <h2 class="text-xl font-bold mb-2">All Features</h2>
    <p class="text-on-surface-variant mb-6">Browse and select what you need.</p>

    <!-- Sticky selection summary -->
    <div
      v-if="store.selectedCount > 0"
      class="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-divider -mx-6 px-6 py-3 mb-6 flex items-center justify-between"
    >
      <span class="text-sm font-medium text-on-surface">
        {{ store.selectedCount }} features selected
      </span>
      <div class="flex gap-3">
        <button class="text-xs text-on-surface-variant hover:text-on-surface" @click="store.reset()">
          Clear all
        </button>
        <button
          class="text-sm bg-primary text-on-primary px-3 py-1 rounded-lg font-semibold hover:opacity-90"
          @click="onReview"
        >
          Review
        </button>
      </div>
    </div>

    <div class="relative mb-8">
      <svg class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" viewBox="0 0 24 24">
        <path :d="mdiMagnify" fill="currentColor" />
      </svg>
      <input
        v-model="query"
        class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none transition-colors"
        placeholder="Search features..."
        type="text"
      >
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 text-xs text-on-surface-variant mb-6">
      <div class="flex items-center gap-1.5">
        <svg class="w-4 h-4" viewBox="0 0 20 20">
          <circle
            class="text-primary"
            cx="10"
            cy="10"
            fill="currentColor"
            r="10"
          />
          <path
            class="text-on-primary"
            d="M6 10l3 3 5-5"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
        Selected
      </div>
      <div class="flex items-center gap-1.5">
        <svg class="w-4 h-4 text-on-surface-variant/50" fill="none" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            stroke-width="1.5"
          />
        </svg>
        Available
      </div>
      <div class="flex items-center gap-1.5">
        <svg class="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 20 20">
          <circle
            cx="10"
            cy="10"
            r="9"
            stroke="currentColor"
            stroke-dasharray="3 2"
            stroke-width="1.5"
          />
          <path d="M8 7l4 3-4 3" fill="currentColor" />
        </svg>
        Dependency
      </div>
    </div>

    <div v-for="[category, features] in grouped" :key="category" class="mb-8">
      <h3 class="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 capitalize flex items-center gap-2">
        <svg v-if="CATEGORY_ICONS[category]" class="w-4 h-4" viewBox="0 0 24 24">
          <path :d="CATEGORY_ICONS[category]" fill="currentColor" />
        </svg>
        {{ category }} ({{ features.length }})
      </h3>
      <div class="flex flex-col gap-2">
        <FeatureCard
          v-for="feature in features"
          :key="feature.id"
          :active="store.isSelected(feature.id)"
          :auto="!store.isSelected(feature.id) && store.resolved.autoIncluded.includes(feature.id)"
          :feature
          :reason="store.resolved.reasons[feature.id]"
          @click="store.toggle(feature.id)"
        />
      </div>
    </div>

    <p v-if="filtered.length === 0" class="text-center text-on-surface-variant py-8">
      No features match "{{ query }}"
    </p>
  </div>
</template>
