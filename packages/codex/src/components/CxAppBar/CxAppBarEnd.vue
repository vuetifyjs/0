<script lang="ts">
  export interface CxAppBarEndProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxAppBarEnd' })
</script>

<template>
  <div class="codex-app-bar__end">
    <slot />
  </div>
</template>

<style scoped>
  .codex-app-bar__end {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
