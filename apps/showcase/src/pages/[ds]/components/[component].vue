<script setup lang="ts">
  // Utilities
  import { useRoute } from 'vue-router'

  const route = useRoute()
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">{{ route.params.component }}</h1>
    <p class="text-on-surface-variant">Component detail for {{ route.params.ds }}.</p>
  </div>
</template>
