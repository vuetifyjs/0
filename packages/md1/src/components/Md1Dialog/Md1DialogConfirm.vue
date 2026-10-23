<script lang="ts">
  // Framework
  import { AlertDialog, isUndefined, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AlertDialogActionProps } from '@vuetify/v0'

  // Components
  import Md1Button from '../Md1Button/Md1Button.vue'

  export interface Md1DialogConfirmProps extends Pick<AlertDialogActionProps, 'namespace' | 'disabled'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogConfirm' })

  defineSlots<{
    /** The label; "OK" from the locale by default, or the verb that names the outcome. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** The committed value, as the dialog closes. */
    confirm: [value: unknown]
  }>()

  const { namespace: _namespace, disabled = false } = defineProps<Md1DialogConfirmProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogConfirm', context)

  const locale = useLocale()

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const variant = toRef(() => context?.variant.value ?? 'alert')
  const label = toRef(() => locale.ti('Md1.ok') ?? 'OK')

  // The affirmative action waits until a choice is made in a confirmation dialog (dialogs page).
  const inert = toRef(() => disabled || (variant.value === 'confirmation' && isUndefined(context?.value.value)))

  function onConfirm () {
    emit('confirm', context?.confirm())
  }
</script>

<!--
  A flat Md1Button: on the renderless AlertDialog.Action under the alert, whose
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
    <Md1Button v-bind="attrs" class="md1-dialog__confirm">
      <slot>{{ label }}</slot>
    </Md1Button>
  </AlertDialog.Action>

  <Md1Button
    v-else
    class="md1-dialog__confirm"
    :disabled="inert"
    @click="onConfirm"
  >
    <slot>{{ label }}</slot>
  </Md1Button>
</template>
