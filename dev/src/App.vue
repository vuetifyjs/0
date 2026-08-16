<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  /** Docs `build:demo` serves the dashboard at `/` under `/demo/emerald/`. */
  const demo = import.meta.env.BASE_URL.includes('/demo/')

  /** Full-bleed product shells (no playground chrome padding) */
  const bare = computed(() =>
    demo
    || route.path === '/emerald'
    || route.path.startsWith('/emerald/'),
  )
</script>

<template>
  <RouterView v-if="demo" />

  <div
    v-else
    class="min-h-screen bg-background text-on-background"
    :class="bare ? undefined : 'p-4'"
  >
    <RouterView />
  </div>
</template>
