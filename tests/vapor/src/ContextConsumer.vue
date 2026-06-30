<script setup vapor lang="ts">
  import { useGreeting } from './context'

  const greeting = useGreeting()
</script>

<template>
  <span data-greeting>{{ greeting.text }}</span>
</template>
