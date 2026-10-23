<script lang="ts">
  // Framework
  import { AlertDialog, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Dialog } from './Md1Dialog.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DialogActivatorProps, DialogActivatorSlotProps } from '@vuetify/v0'

  export interface Md1DialogActivatorProps extends Pick<DialogActivatorProps, 'namespace'> {}

  /**
   * `attrs` carries `type`, `role`, `tabindex`, `aria-haspopup`, `aria-expanded`,
   * `data-open`, `onClick` and `onKeydown` for the trigger.
   */
  export type Md1DialogActivatorSlotProps = DialogActivatorSlotProps
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1DialogActivator' })

  defineSlots<{
    /** The trigger. Spread `attrs` onto it; an `Md1Button` is the usual host. */
    default?: (props: Md1DialogActivatorSlotProps) => any
  }>()

  const { namespace: _namespace } = defineProps<Md1DialogActivatorProps>()

  const context = useMd1Dialog()

  orphan('Md1DialogActivator', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value)
  const alert = toRef(() => context?.variant.value === 'alert')
</script>

<!--
  Renderless on purpose: the trigger is the consumer's Md1Button, and a button
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
