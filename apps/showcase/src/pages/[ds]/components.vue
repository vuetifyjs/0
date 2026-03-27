<script setup lang="ts">
  import { CxCard, CxHeaderAnchor } from '@paper/codex'

  // Composables
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS, getCategories } = useShowcase()

  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => getDS(slug.value))
  const categories = toRef(() => getCategories(slug.value))

  function componentsByCategory (category: string) {
    return ds.value?.components.filter(c => c.category === category) ?? []
  }
</script>

<template>
  <div v-if="ds" class="p-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-2">{{ ds.name }} — Components</h1>
    <p class="text-on-surface-variant mb-8">{{ ds.components.length }} components across {{ categories.length }} categories.</p>

    <template v-for="category in categories" :key="category">
      <CxHeaderAnchor :id="category" tag="h2">
        {{ category }}
      </CxHeaderAnchor>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <router-link
          v-for="component in componentsByCategory(category)"
          :key="component.name"
          class="no-underline text-on-surface"
          :to="`/${slug}/components/${component.name}`"
        >
          <CxCard class="p-4 h-full" hoverable>
            <div class="font-semibold font-mono text-sm mb-1">{{ component.name }}</div>
            <p v-if="component.description" class="text-on-surface-variant text-xs mb-2">{{ component.description }}</p>
            <div v-if="component.subComponents?.length" class="text-xs text-on-surface-variant">
              +{{ component.subComponents.length }} sub-components
            </div>
          </CxCard>
        </router-link>
      </div>
    </template>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
