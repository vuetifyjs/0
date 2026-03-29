<script lang="ts">
  export interface HxAlertTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxAlertTitle' })
</script>

<template>
  <div class="helix-alert__title">
    <slot />
  </div>
</template>

<style scoped>
  .helix-alert__title {
    width: 100%;
    font-weight: 600;
  }
</style>
