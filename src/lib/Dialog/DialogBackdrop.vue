<template>
  <Atom
    v-if="dialog.isOpen.value"
    :as="as"
    data-dialog-backdrop
    :data-state="dialog.dataState.value"
  >
    <slot />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'
  import { Atom, type AtomProps } from '@/lib/Atom'

  defineOptions({ name: 'DialogBackdrop' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<AtomProps>(), { as: 'div' })
</script>
