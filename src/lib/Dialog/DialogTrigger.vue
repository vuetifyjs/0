<template>
  <slot
    v-if="isRenderless"
    v-bind="dialog.getTriggerProps()"
  />
  <Atom
    v-else
    :as="as"
    v-bind="dialog.getTriggerProps()"
  >
    <slot />
  </Atom>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { Atom, type AtomProps } from '@/lib/Atom'
  import { makeIsRenderless } from '@/utils/helpers'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogTrigger' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  const props = withDefaults(defineProps<AtomProps>(), { as: 'button' })
  const isRenderless = toRef(() => makeIsRenderless(props.as))
</script>
