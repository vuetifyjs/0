<script setup lang="ts">
  import { HxBadge, HxCard, HxSearchInput } from '@paper/helix'

  // Composables
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS, getComposableCategories } = useShowcase()

  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => getDS(slug.value))

  const query = shallowRef('')

  const filtered = toRef(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return ds.value?.composables ?? []
    return ds.value?.composables?.filter(c => c.name.toLowerCase().includes(q)) ?? []
  })

  const categories = toRef(() => [...new Set(filtered.value.map(c => c.category))])

  function byCategory (category: string) {
    return filtered.value.filter(c => c.category === category)
  }
</script>

<template>
  <div v-if="ds" class="p-8 max-w-5xl">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-1">{{ ds.name }} — Composables</h1>
      <p class="text-on-surface-variant">
        {{ ds.composables?.length ?? 0 }} composables across {{ getComposableCategories(slug).length }} categories
      </p>
    </div>

    <HxSearchInput
      v-model:query="query"
      class="mb-8 max-w-sm"
      placeholder="Filter composables..."
    />

    <p v-if="filtered.length === 0" class="text-on-surface-variant">
      No composables match "{{ query }}".
    </p>

    <template v-for="category in categories" :key="category">
      <h2 class="text-lg font-semibold mb-3 mt-6 first:mt-0">{{ category }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <router-link
          v-for="composable in byCategory(category)"
          :key="composable.name"
          class="no-underline text-on-surface"
          :to="`/${slug}/composables/${composable.name}`"
        >
          <HxCard class="p-4 h-full" hoverable>
            <div class="flex items-start justify-between gap-2 mb-1">
              <span class="font-semibold font-mono text-sm">{{ composable.name }}</span>
              <HxBadge color="primary" variant="subtle">
                {{ composable.category }}
              </HxBadge>
            </div>
            <p v-if="composable.description" class="text-on-surface-variant text-xs">
              {{ composable.description }}
            </p>
          </HxCard>
        </router-link>
      </div>
    </template>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
