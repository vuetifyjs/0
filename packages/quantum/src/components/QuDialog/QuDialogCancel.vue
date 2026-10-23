<script lang="ts">
  // Framework
  import { AlertDialog, Dialog, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDialog } from './QuDialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogCloseProps, DialogCloseSlotProps } from '@vuetify/v0'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  export interface QuDialogCancelProps extends Pick<DialogCloseProps, 'namespace'> {}

  /**
   * `Dialog.Close` names itself "Close" from the locale, which would replace
   * the visible label as the accessible name; the label is the name here.
   */
  function unnamed (attrs: DialogCloseSlotProps['attrs']): Omit<DialogCloseSlotProps['attrs'], 'aria-label'> {
    const { 'aria-label': _label, ...rest } = attrs

    return rest
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogCancel' })

  defineSlots<{
    /** The label; "Cancel" from the locale by default. A dismissive label never merely answers the question. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<QuDialogCancelProps>()

  const context = useQuDialog()

  orphan('QuDialogCancel', context)

  const locale = useLocale()

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const variant = toRef(() => context?.variant.value ?? 'alert')
  const label = toRef(() => locale.ti('Quantum.cancel') ?? 'Cancel')

  function onClick () {
    context?.close()
  }
</script>

<!--
  A flat QuButton on the v0 part that owns the close: AlertDialog.Cancel under
  the alert, Dialog.Close otherwise. Both are renderless so the QuButton is the
  one button. A full-screen dialog closes through the root so a dirty one can
  prompt before discarding.
-->
<template>
  <AlertDialog.Cancel v-if="variant === 'alert'" v-slot="{ attrs }" :namespace renderless>
    <QuButton v-bind="attrs" class="quantum-dialog__cancel">
      <slot>{{ label }}</slot>
    </QuButton>
  </AlertDialog.Cancel>

  <QuButton v-else-if="variant === 'full-screen'" class="quantum-dialog__cancel" @click="onClick">
    <slot>{{ label }}</slot>
  </QuButton>

  <Dialog.Close v-else v-slot="{ attrs }" :namespace renderless>
    <QuButton v-bind="unnamed(attrs)" class="quantum-dialog__cancel">
      <slot>{{ label }}</slot>
    </QuButton>
  </Dialog.Close>
</template>
