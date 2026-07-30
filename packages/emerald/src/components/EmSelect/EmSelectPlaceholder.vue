<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

  export interface EmSelectPlaceholderProps {
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelectPlaceholder' })

  const { namespace } = defineProps<EmSelectPlaceholderProps>()
</script>

<template>
  <Select.Placeholder class="emerald-select__placeholder" :namespace>
    <slot />
  </Select.Placeholder>
</template>

<style>
  .emerald-select__placeholder {
    color: var(--emerald-neutral-500, #a3afbe);
  }
</style>
