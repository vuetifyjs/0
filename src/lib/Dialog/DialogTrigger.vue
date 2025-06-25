<template>
  <Atom
    v-slot="slotProps"
    :as="as"
    :renderless="renderless"
    v-bind="dialog.getTriggerProps()"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { Atom, type AtomProps } from '@/lib/Atom'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogTrigger' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<AtomProps>(), { as: 'button', renderless: false })
</script>
