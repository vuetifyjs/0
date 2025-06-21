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
  import { watch } from 'vue'
  import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
  import { Atom, type AtomProps } from '@/lib/Atom'

  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogContent' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
  defineProps<AtomProps>()

  // TODO: fix focus trap
  const { activate, deactivate } = useFocusTrap(dialog.dialogRef, {
    immediate: false,
    fallbackFocus: document.body,
  })

  watch(
    dialog.isOpen,
    isOpen => {
      if (isOpen) {
        activate()
      } else {
        deactivate()
      }
    },
    { immediate: true },
  )
</script>
