<script setup lang="ts">
  // Composables
  import { useShowcase } from '../composables/useShowcase'

  const { designSystems } = useShowcase()
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold mb-6">Paper Showcase</h1>
    <p class="text-on-surface-variant mb-8">Design system showcase and comparison tool.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <router-link
        v-for="ds in designSystems"
        :key="ds.slug"
        class="home-card no-underline text-on-surface"
        :to="`/${ds.slug}`"
      >
        <h2 class="text-xl font-semibold">{{ ds.name }}</h2>
      </router-link>
    </div>
  </div>
</template>
