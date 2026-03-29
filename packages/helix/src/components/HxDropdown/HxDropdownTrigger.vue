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
  cursor: pointer;
}
</style>
