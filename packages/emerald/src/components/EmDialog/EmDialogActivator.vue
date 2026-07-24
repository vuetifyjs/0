<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogActivator' })
</script>

<template>
  <Dialog.Activator class="emerald-dialog__activator">
    <slot />
  </Dialog.Activator>
</template>
