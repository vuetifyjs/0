<script lang="ts">
  // Framework
  import { AlertDialog, Dialog, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogCloseProps, DialogCloseSlotProps } from '@vuetify/v0'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'

  export interface Md1DialogCancelProps extends Pick<DialogCloseProps, 'namespace'> {}

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
  defineOptions({ name: 'Md1DialogCancel' })

  defineSlots<{
    /** The label; "Cancel" from the locale by default. A dismissive label never merely answers the question. */
    default?: () => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DialogCancelProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogCancel', context)

  const locale = useLocale()

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const variant = toRef(() => context?.variant.value ?? 'alert')
  const label = toRef(() => locale.ti('Md1.cancel') ?? 'Cancel')

  function onClick () {
    context?.close()
  }
</script>

<!--
  A flat Md1Button on the v0 part that owns the close: AlertDialog.Cancel under
  the alert, Dialog.Close otherwise. Both are renderless so the Md1Button is the
  one button. A full-screen dialog closes through the root so a dirty one can
  prompt before discarding.
-->
<template>
  <AlertDialog.Cancel v-if="variant === 'alert'" v-slot="{ attrs }" :namespace renderless>
    <Md1Button v-bind="attrs" class="md1-dialog__cancel">
      <slot>{{ label }}</slot>
    </Md1Button>
  </AlertDialog.Cancel>

  <Md1Button v-else-if="variant === 'full-screen'" class="md1-dialog__cancel" @click="onClick">
    <slot>{{ label }}</slot>
  </Md1Button>

  <Dialog.Close v-else v-slot="{ attrs }" :namespace renderless>
    <Md1Button v-bind="unnamed(attrs)" class="md1-dialog__cancel">
      <slot>{{ label }}</slot>
    </Md1Button>
  </Dialog.Close>
</template>
