<script setup lang="ts">
  // Composables
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()

  const ds = toRef(() => getDS(route.params.ds as string))

  const section = toRef(() => {
    return ds.value?.sections?.find(s => s.slug === route.params.section)
  })
</script>

<template>
  <div v-if="section" class="p-8 max-w-3xl">
    <h1 class="text-3xl font-bold mb-8">{{ section.title }}</h1>
    <component :is="section.component" />
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Section not found.</p>
  </div>
</template>
