<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Types
  import type { DialogActivatorProps } from '@vuetify/v0'

  /**
   * `renderless` makes Activator a pure slot host — bind `attrs` onto your own
   * trigger (e.g. EmButton) so you do not nest interactive elements.
   */
  export interface EmDialogActivatorProps extends Omit<DialogActivatorProps, 'as'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogActivator' })

  const {
    renderless = false,
    namespace,
  } = defineProps<EmDialogActivatorProps>()
</script>

<template>
  <Dialog.Activator
    v-slot="slotProps"
    class="emerald-dialog__activator"
    :namespace
    :renderless
  >
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
