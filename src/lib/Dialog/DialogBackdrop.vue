<template>
  <Atom
    v-if="dialog.isOpen.value"
    :as="as"
    data-dialog-backdrop
    :data-state="dialog.dataState.value"
    :renderless="renderless"
  >
    <slot />
  </Atom>
</template>

<script lang="ts">
  import type { AtomProps } from '@/lib/Atom'
  export interface DialogBackdropProps extends AtomProps {}
</script>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'
  import { Atom } from '@/lib/Atom'

  defineOptions({ name: 'DialogBackdrop' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<DialogBackdropProps>(), { as: 'div', renderless: false })
</script>
