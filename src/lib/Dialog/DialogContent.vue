<template>
  <Atom
    v-if="dialog.isOpen.value"
    :as="as"
    :props="dialog.getDialogProps()"
    :renderless="renderless"
  >
    <slot />
  </Atom>
</template>

<script lang="ts">
  import type { AtomProps } from '@/lib/Atom'
  export interface DialogContentProps extends AtomProps {}
</script>

<script setup lang="ts">
  import { Atom } from '@/lib/Atom'
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogContent' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<DialogContentProps>(), { as: 'div', renderless: false })
</script>
