<script setup lang="ts">
  // Types
  import type { Component } from 'vue'

  const props = defineProps<{
    component?: Component
    html?: string
  }>()
</script>

<template>
  <div class="markdown-body flex-1 min-h-0 overflow-y-auto px-5 py-4">
    <component
      :is="props.component"
      v-if="props.component"
    />

    <div
      v-else-if="props.html"
      v-html="props.html"
    />
  </div>
</template>
