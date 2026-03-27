<script lang="ts">
  // Framework
  import { PopoverRoot } from '@vuetify/v0'

  export interface CxDropdownProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxDropdown' })

  const { id } = defineProps<CxDropdownProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <PopoverRoot :id v-model="model">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverRoot>
</template>
