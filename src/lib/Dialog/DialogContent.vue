<template>
  <Atom
    v-if="dialog.isOpen.value"
    v-bind="dialog.getDialogProps()"
    :as="as"
  >
    <slot />
  </Atom>
</template>

<script setup lang="ts">
  import { Atom, type AtomProps } from '@/lib/Atom'
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogContent' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  defineProps<AtomProps>()
</script>
