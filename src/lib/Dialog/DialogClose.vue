<template>
  <Atom
    v-slot="slotProps"
    :as="as"
    :props="dialog.getCloseProps()"
    :renderless="renderless"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'
  import { Atom, type AtomProps } from '@/lib/Atom'

  defineOptions({ name: 'DialogClose' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<AtomProps>(), { as: 'button', renderless: false })
</script>
