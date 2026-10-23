<script setup lang="ts">
  import { BChips } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const picked = shallowRef(['on'])

  const items = [
    { value: 'off', text: 'Default' },
    { value: 'on', text: 'Active' },
  ]
</script>

<template>
  <div class="d-flex flex-wrap gap-2">
    <BChips v-model="picked" :items theme="primary" />
  </div>
</template>
