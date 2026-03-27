<script setup lang="ts">
  import { CxCard } from '@paper/codex'

  // Composables
  import { useShowcase } from '../composables/useShowcase'

  const { designSystems } = useShowcase()
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-2">Paper Showcase</h1>
    <p class="text-on-surface-variant mb-8">Design system showcase and comparison tool.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="ds in designSystems"
        :key="ds.slug"
        class="no-underline text-on-surface"
        :to="`/${ds.slug}`"
      >
        <CxCard class="p-6 h-full" hoverable>
          <h2 class="text-xl font-semibold mb-2">{{ ds.name }}</h2>
          <p v-if="ds.description" class="text-on-surface-variant text-sm mb-4">{{ ds.description }}</p>
          <div class="flex gap-4 text-sm text-on-surface-variant">
            <span>{{ ds.components.length }} components</span>
            <span>Prefix: <code class="font-mono">{{ ds.prefix }}</code></span>
          </div>
        </CxCard>
      </router-link>
    </div>
  </div>
</template>
