<script lang="ts">
  export interface HxAlertContentProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAlertContent' })
</script>

<template>
  <div class="helix-alert__content">
    <slot />
  </div>
</template>

<style scoped>
  .helix-alert__content {
    flex: 1;
    min-width: 0;
  }
</style>
