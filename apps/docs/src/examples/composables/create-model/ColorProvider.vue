<script setup lang="ts">
  import { createColorModel, provideColors } from './model'

  const model = createColorModel()

  provideColors(model)
</script>

<template>
  <slot />
</template>
