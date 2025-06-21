<template>
  <slot
    v-if="isRenderless"
    v-bind="dialog.getCloseProps()"
  />
  <Atom
    v-else
    :as="as"
    v-bind="dialog.getCloseProps()"
  >
    <slot />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { makeIsRenderless } from '@/utils/helpers'
  import { useContext } from '@/composables/context'
  import { Atom, type AtomProps } from '@/lib/Atom'

  defineOptions({ name: 'DialogClose' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  const props = withDefaults(defineProps<AtomProps>(), { as: 'button' })
  const isRenderless = toRef(() => makeIsRenderless(props.as))
</script>
