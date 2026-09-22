<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Progress } from '../Progress/index'

  const value = shallowRef(60)
</script>

<template>
  <Progress.Root :model-value="value">
    <Progress.Track>
      <Progress.Fill />
    </Progress.Track>

    <Progress.Value />
  </Progress.Root>
</template>
