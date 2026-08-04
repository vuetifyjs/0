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
    /* neutral-700, not 500: 500 reads ~2.2-2.4:1 against surface in both themes */
    color: var(--emerald-neutral-700, #5a6472);
  }
</style>
