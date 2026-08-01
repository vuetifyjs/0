<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const bare = toRef(() => route.path.startsWith('/onyx'))
</script>

<template>
  <div class="min-h-screen" :class="bare ? '' : 'bg-background text-on-background p-4'">
    <RouterView />
  </div>
</template>
