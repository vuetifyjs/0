<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Input } from '../../Input/index'

  const email = shallowRef('')
</script>

<template>
  <!-- Degenerate: label / description / error omitted; no placeholder name either. -->
  <Input.Root v-model="email">
    <Input.Control />
  </Input.Root>
</template>
