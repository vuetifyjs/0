<template>
  <Teleport v-if="dialog.isOpen" to="body">
    <div :data-state="dialog.dataState.value">
      <slot />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { DialogSymbol } from './useDialog'
  import { useContext } from '@/composables/context'

  defineOptions({ name: 'DialogPortal' })

  const [injectDialog] = useContext(DialogSymbol)
  const dialog = injectDialog()
</script>
