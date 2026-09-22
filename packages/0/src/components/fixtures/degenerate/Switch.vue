<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Switch } from '../../Switch/index'

  const enabled = ref(false)
</script>

<template>
  <Switch.Root v-model="enabled">
    <Switch.Track>
      <Switch.Thumb />
    </Switch.Track>
  </Switch.Root>
</template>
