<script setup lang="ts">
  import { Portal } from '../Portal/index'
</script>

<template>
  <Portal>
    <template #default="{ zIndex }">
      <div :style="{ zIndex }">Overlay content</div>
    </template>
  </Portal>
</template>
