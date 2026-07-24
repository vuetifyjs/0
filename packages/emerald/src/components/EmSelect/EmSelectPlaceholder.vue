<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectPlaceholder' })
</script>

<template>
  <Select.Placeholder class="emerald-select__placeholder">
    <slot />
  </Select.Placeholder>
</template>

<style>
  .emerald-select__placeholder {
    color: var(--emerald-neutral-500, #a3afbe);
  }
</style>
