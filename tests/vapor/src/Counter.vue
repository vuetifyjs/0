<script setup vapor lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  const count = shallowRef(0)

  function increment () {
    count.value++
  }
</script>

<template>
  <button type="button" @click="increment">Count: {{ count }}</button>
</template>
