<script setup lang="ts">
  import { provideToasts } from './toasts'

  provideToasts()
</script>

<template>
  <slot />
</template>
