<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Presence } from '../Presence/index'

  const open = shallowRef(true)
</script>

<template>
  <Presence v-slot="{ attrs }" v-model="open">
    <div v-bind="attrs">Content</div>
  </Presence>
</template>
