<script lang="ts">
  export interface EmAlertDescriptionProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAlertDescription' })
</script>

<template>
  <div class="emerald-alert__description">
    <slot />
  </div>
</template>

<style scoped>
.emerald-alert__description {
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  overflow-wrap: break-word;
}
</style>
