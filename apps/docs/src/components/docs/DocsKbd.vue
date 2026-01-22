<script setup lang="ts">
  defineOptions({ name: 'DocsKbd' })
</script>

<template>
  <kbd class="px-1.5 py-0.5 rounded bg-surface-tint text-on-surface-tint text-xs font-mono">
    <slot />
  </kbd>
</template>
