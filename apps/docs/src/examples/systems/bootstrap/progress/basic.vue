<script setup lang="ts">
  import { BProgress } from '@paper/bootstrap'
</script>

<template>
  <div class="d-grid gap-3">
    <BProgress
      label="Basic example"
      :model-value="0"
    />

    <BProgress
      label="Basic example"
      :model-value="25"
    />

    <BProgress
      label="Basic example"
      :model-value="50"
    />

    <BProgress
      label="Basic example"
      :model-value="75"
    />

    <BProgress
      label="Basic example"
      :model-value="100"
    />
  </div>
</template>
