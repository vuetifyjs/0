<script setup vapor lang="ts">
  // Context
  import ContextConsumer from './ContextConsumer.vue'

  import { provideGreeting } from './context'

  provideGreeting({ text: 'hello-vapor' })
</script>

<template>
  <ContextConsumer />
</template>
