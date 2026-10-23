<script lang="ts">
  // Framework
  import { AlertDialog, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useQuDialog } from './QuDialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogActivatorProps, DialogActivatorSlotProps } from '@vuetify/v0'

  export interface QuDialogActivatorProps extends Pick<DialogActivatorProps, 'namespace'> {}

  /**
   * `attrs` carries `type`, `role`, `tabindex`, `aria-haspopup`, `aria-expanded`,
   * `data-open`, `onClick` and `onKeydown` for the trigger.
   */
  export type QuDialogActivatorSlotProps = DialogActivatorSlotProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogActivator' })

  defineSlots<{
    /** The trigger. Spread `attrs` onto it; a `QuButton` is the usual host. */
    default?: (props: QuDialogActivatorSlotProps) => any
  }>()

  const { namespace: _namespace } = defineProps<QuDialogActivatorProps>()

  const context = useQuDialog()

  orphan('QuDialogActivator', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const alert = toRef(() => context?.variant.value === 'alert')
</script>

<!--
  Renderless on purpose: the trigger is the consumer's QuButton, and a button
  rendered around another button is invalid markup with two click targets.
-->
<template>
  <AlertDialog.Activator v-if="alert" v-slot="slotProps" :namespace renderless>
    <slot v-bind="slotProps" />
  </AlertDialog.Activator>

  <Dialog.Activator v-else v-slot="slotProps" :namespace renderless>
    <slot v-bind="slotProps" />
  </Dialog.Activator>
</template>
