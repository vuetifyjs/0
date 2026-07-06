<script lang="ts">
  export interface EmToastTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmToastTitle' })
</script>

<template>
  <div class="emerald-toast__title">
    <slot />
  </div>
</template>

<style scoped>
.emerald-toast__title {
  flex: 1 0 0;
  min-width: 0;
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-bold-weight);
  line-height: var(--emerald-text-b2-height);
  color: var(--emerald-toast-title);
  overflow-wrap: break-word;
}
</style>
