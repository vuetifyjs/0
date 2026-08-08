<script lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  export interface EmPopoverProps {
    id?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmPopover' })

  const { id } = defineProps<EmPopoverProps>()

  const model = defineModel<boolean>()
</script>

<template>
  <Popover.Root :id v-model="model">
    <slot />
  </Popover.Root>
</template>
