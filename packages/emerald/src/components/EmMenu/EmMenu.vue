<script lang="ts">
  // Framework
  import { PopoverRoot } from '@vuetify/v0'

  export interface EmMenuProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenu' })

  const { id } = defineProps<EmMenuProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <PopoverRoot
    :id
    v-model="model"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverRoot>
</template>
