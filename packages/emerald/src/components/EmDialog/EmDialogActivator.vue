<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export interface EmDialogActivatorProps {
    /**
     * When true, Activator is a pure slot host — bind `attrs` onto your own
     * trigger (e.g. EmButton) so you do not nest interactive elements.
     */
    renderless?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogActivator' })

  const { renderless = false } = defineProps<EmDialogActivatorProps>()
</script>

<template>
  <Dialog.Activator v-slot="slotProps" class="emerald-dialog__activator" :renderless>
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
