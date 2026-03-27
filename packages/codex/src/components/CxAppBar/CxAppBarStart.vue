<script lang="ts">
  export interface CxAppBarStartProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBarStart' })
</script>

<template>
  <div class="codex-app-bar__start">
    <slot />
  </div>
</template>

<style scoped>
  .codex-app-bar__start {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
