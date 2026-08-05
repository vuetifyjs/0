<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export interface OnDialogActivatorProps {
    /**
     * When true, the activator is a pure slot host — bind `attrs` onto your
     * own trigger (e.g. OnButton) so you never nest interactive elements.
     */
    renderless?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogActivator' })

  const { renderless = false } = defineProps<OnDialogActivatorProps>()
</script>

<template>
  <Dialog.Activator v-slot="slotProps" :renderless>
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
