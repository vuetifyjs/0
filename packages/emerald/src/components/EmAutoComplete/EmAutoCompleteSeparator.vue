<script lang="ts">
  export interface EmAutoCompleteSeparatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoCompleteSeparator' })
</script>

<template>
  <div class="emerald-auto-complete__separator-wrapper">
    <div
      aria-orientation="horizontal"
      class="emerald-auto-complete__separator"
      role="separator"
    />
  </div>
</template>

<style>
.emerald-auto-complete__separator-wrapper {
  display: flex;
  align-items: center;
  height: var(--emerald-spacing-m);
  padding: 0 var(--emerald-spacing-2xs);
}

.emerald-auto-complete__separator {
  flex: 1;
  border-top: var(--emerald-stroke-s) dashed var(--emerald-divider);
}
</style>
