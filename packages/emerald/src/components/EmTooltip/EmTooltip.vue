<script lang="ts">
  // Framework
  import { PopoverRoot } from '@vuetify/v0'

  export interface EmTooltipProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltip' })

  const { id } = defineProps<EmTooltipProps>()

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
