<script setup lang="ts">
  import {
    EmButton,
    EmSnackbar,
    EmSnackbarClose,
    EmSnackbarContent,
    EmSnackbarPortal,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-toast-demo">
    <EmButton @click="open = true">Save changes</EmButton>

    <EmSnackbarPortal :teleport="false">
      <EmSnackbar v-if="open" variant="success" @dismiss="open = false">
        <EmSnackbarContent>Changes saved.</EmSnackbarContent>

        <EmSnackbarClose />
      </EmSnackbar>
    </EmSnackbarPortal>
  </div>
</template>

<style>
  .emerald-docs-toast-demo {
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-height: 140px;
  }
</style>
