<template>
  <Atom
    v-slot="slotProps"
    :as="as"
    :props="dialog.getTriggerProps()"
    :renderless="renderless"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol, type DialogContext } from './useDialog'
  import { Atom, type AtomProps } from '@/lib/Atom'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogTrigger' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<AtomProps>(), { as: 'button', renderless: false })

  defineSlots<{
    default: (props: ReturnType<DialogContext['getTriggerProps']>) => any
  }>()
</script>
