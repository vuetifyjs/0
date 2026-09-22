<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { AlertDialog } from '../AlertDialog/index'

  const open = shallowRef(true)
</script>

<template>
  <AlertDialog.Root v-model="open">
    <AlertDialog.Activator>Delete Item</AlertDialog.Activator>

    <AlertDialog.Content>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>This action cannot be undone.</AlertDialog.Description>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Confirm</AlertDialog.Action>
    </AlertDialog.Content>
  </AlertDialog.Root>
</template>
