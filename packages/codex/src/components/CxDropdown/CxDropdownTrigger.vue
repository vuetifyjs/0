<script lang="ts">
  // Framework
  import { PopoverActivator } from '@vuetify/v0'

  export interface CxDropdownTriggerProps {
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxDropdownTrigger' })

  const { as = 'button' } = defineProps<CxDropdownTriggerProps>()
</script>

<template>
  <PopoverActivator :as class="codex-dropdown__trigger">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverActivator>
</template>

<style scoped>
.codex-dropdown__trigger {
  cursor: pointer;
}
</style>
