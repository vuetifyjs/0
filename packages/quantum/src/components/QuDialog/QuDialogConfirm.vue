<script lang="ts">
  // Framework
  import { AlertDialog, isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuDialog } from './QuDialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AlertDialogActionProps } from '@vuetify/v0'

  // Components
  import QuButton from '../QuButton/QuButton.vue'

  export interface QuDialogConfirmProps extends Pick<AlertDialogActionProps, 'namespace' | 'disabled'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDialogConfirm' })

  defineSlots<{
    /** The label; "OK" from the locale by default, or the verb that names the outcome. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** The committed value, as the dialog closes. */
    confirm: [value: unknown]
  }>()

  const { namespace: _namespace, disabled = false } = defineProps<QuDialogConfirmProps>()

  const context = useQuDialog()

  orphan('QuDialogConfirm', context)

  const locale = useLocale()

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const variant = toRef(() => context?.variant.value ?? 'alert')
  const label = toRef(() => locale.ti('Quantum.ok') ?? 'OK')

  // The affirmative action waits until a choice is made in a confirmation dialog (dialogs page).
  const inert = toRef(() => disabled || (variant.value === 'confirmation' && isUndefined(context?.value.value)))

  function onConfirm () {
    emit('confirm', context?.confirm())
  }
</script>

<!--
  A flat QuButton: on the renderless AlertDialog.Action under the alert, whose
  own click closes the dialog; a plain button that commits through the root otherwise.
-->
<template>
  <AlertDialog.Action
    v-if="variant === 'alert'"
    v-slot="{ attrs }"
    :disabled="inert"
    :namespace
    renderless
    @action="onConfirm"
  >
    <QuButton v-bind="attrs" class="quantum-dialog__confirm">
      <slot>{{ label }}</slot>
    </QuButton>
  </AlertDialog.Action>

  <QuButton
    v-else
    class="quantum-dialog__confirm"
    :disabled="inert"
    @click="onConfirm"
  >
    <slot>{{ label }}</slot>
  </QuButton>
</template>
