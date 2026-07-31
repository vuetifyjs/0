<script setup lang="ts">
  // Utilities
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()

  /** Full-bleed product shells (no app chrome padding) */
  const bare = computed(() => route.path === '/emerald' || route.path.startsWith('/emerald/'))
</script>

<template>
  <div
    class="min-h-screen bg-background text-on-background"
    :class="bare ? undefined : 'p-4'"
  >
    <RouterView />
  </div>
</template>
