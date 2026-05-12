<script lang="ts">
  // Framework
  import { DialogActivator } from '@vuetify/v0'

  export interface EmDialogActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogActivator' })
</script>

<template>
  <DialogActivator class="emerald-dialog__activator">
    <slot />
  </DialogActivator>
</template>
