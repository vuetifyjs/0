<script setup lang="ts">
  import { Overflow } from '../Overflow/index'

  const tags = ['alpha', 'beta', 'gamma', 'delta']
</script>

<template>
  <Overflow.Root style="display: flex; gap: 8px; overflow: hidden; width: 120px">
    <Overflow.Item v-for="tag in tags" :key="tag">{{ tag }}</Overflow.Item>
    <Overflow.Indicator v-slot="{ count }">+{{ count }} more</Overflow.Indicator>
  </Overflow.Root>
</template>
