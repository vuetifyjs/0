<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Single } from '../Single/index'

  const selected = ref()
</script>

<template>
  <Single.Root v-model="selected">
    <Single.Item value="option1">Option 1</Single.Item>
    <Single.Item value="option2">Option 2</Single.Item>
  </Single.Root>
</template>
