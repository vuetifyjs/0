<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BProgress } from '@paper/bootstrap'

  const value = shallowRef(25)
</script>

<template>
  <div class="d-grid gap-3">
    <BProgress v-model="value" label="Basic example" />
    <BProgress v-model="value" label="Default striped example" striped />

    <BProgress v-model="value" animated label="Example with label" striped>
      {{ value }}%
    </BProgress>
  </div>
</template>
