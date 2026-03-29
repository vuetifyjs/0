<script lang="ts">
  // Framework
  import { PopoverActivator } from '@vuetify/v0'

  export interface HxDropdownTriggerProps {
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxDropdownTrigger' })

  const { as = 'button' } = defineProps<HxDropdownTriggerProps>()
</script>

<template>
  <PopoverActivator :as class="helix-dropdown__trigger">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverActivator>
</template>

<style scoped>
.helix-dropdown__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--v0-divider);
  border-radius: 0.375rem;
  background-color: var(--v0-surface);
  color: var(--v0-on-surface);
  font: inherit;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.helix-dropdown__trigger:hover {
  background-color: var(--v0-surface-tint);
  border-color: var(--v0-on-surface-variant);
}

.helix-dropdown__trigger:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: -2px;
}
</style>
