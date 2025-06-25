<template>
  <Teleport v-if="dialog.isOpen" to="body">
    <Atom
      :as="as"
      :data-state="dialog.dataState.value"
      :renderless="renderless"
    >
      <slot />
    </Atom>
  </Teleport>
</template>

<script lang="ts">
  import type { AtomProps } from '../Atom'
  export interface DialogPortalProps extends AtomProps {}
</script>

<script setup lang="ts">
  import { Atom } from '../Atom'
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogPortal' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  withDefaults(defineProps<DialogPortalProps>(), { as: 'div' })
</script>
