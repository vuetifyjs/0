<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { NumberField } from '../NumberField/index'

  const value = ref<number | null>(0)
</script>

<template>
  <NumberField.Root v-model="value" :max="100" :min="0">
    <NumberField.Decrement>-</NumberField.Decrement>
    <NumberField.Control />
    <NumberField.Increment>+</NumberField.Increment>
  </NumberField.Root>
</template>
