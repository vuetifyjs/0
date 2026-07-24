<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
</script>

<script setup lang="ts" generic="T = unknown">
  defineOptions({ name: 'EmSelect' })

  const model = defineModel<T | T[]>()
</script>

<template>
  <Select.Root v-model="model" class="emerald-select">
    <slot />
  </Select.Root>
</template>

<style>
  .emerald-select {
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    width: 100%;
  }
</style>
