<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Input } from '../../Input/index'

  const email = ref('')
</script>

<template>
  <Input.Root v-model="email">
    <Input.Control placeholder="Email" />
  </Input.Root>
</template>
