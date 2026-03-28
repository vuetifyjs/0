<script lang="ts">
  export interface HxAppBarStartProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAppBarStart' })
</script>

<template>
  <div class="helix-app-bar__start">
    <slot />
  </div>
</template>

<style scoped>
  .helix-app-bar__start {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
