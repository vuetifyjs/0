<script lang="ts">
  export interface EmAlertTitleProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertTitle' })
</script>

<template>
  <div class="emerald-alert__title">
    <slot />
  </div>
</template>

<style scoped>
.emerald-alert__title {
  width: 100%;
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-bold-weight);
  line-height: var(--emerald-text-b2-height);
  overflow-wrap: break-word;
}
</style>
