<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { AlertDialog } from '../../AlertDialog/index'

  const open = shallowRef(true)
</script>

<template>
  <AlertDialog.Root v-model="open">
    <AlertDialog.Activator>Delete</AlertDialog.Activator>

    <AlertDialog.Content>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Delete</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Root>
</template>
