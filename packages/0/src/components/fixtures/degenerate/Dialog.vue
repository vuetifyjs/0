<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Dialog } from '../../Dialog/index'

  const open = shallowRef(true)
</script>

<template>
  <Dialog.Root v-model="open">
    <Dialog.Activator>Open Dialog</Dialog.Activator>

    <Dialog.Content>
      <p>Dialog content goes here.</p>
      <Dialog.Close>Close</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
</template>
