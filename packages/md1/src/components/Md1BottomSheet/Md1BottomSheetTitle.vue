<script lang="ts">
  // Framework
  import { Atom, Dialog } from '@vuetify/v0'

  // Context
  import { orphan, useMd1BottomSheet } from './context'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1BottomSheetTitle' })

  defineSlots<{
    /** The title text: Regular 16 sp at the secondary ink. */
    default?: () => any
  }>()

  const context = useMd1BottomSheet()

  orphan('Md1BottomSheetTitle', context)

  const modal = toRef(() => !!context && !context.persistent.value)

  // The modal title is Dialog.Title, which names the <dialog> itself; a
  // persistent sheet names its <aside> through the id the root hands out.
  const withdraw = context?.label()

  onBeforeUnmount(() => withdraw?.())
</script>

<template>
  <Dialog.Title v-if="modal" class="md1-bottom-sheet__title">
    <slot />
  </Dialog.Title>

  <Atom
    v-else
    :id="context?.titleId.value"
    as="h2"
    class="md1-bottom-sheet__title"
  >
    <slot />
  </Atom>
</template>
