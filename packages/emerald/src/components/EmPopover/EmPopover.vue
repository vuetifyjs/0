<script lang="ts">
  // Framework
  import { Popover } from '@vuetify/v0'

  // Types
  import type { PopoverRootProps } from '@vuetify/v0'

  export interface EmPopoverProps extends Omit<PopoverRootProps, 'as' | 'renderless'> {}
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
