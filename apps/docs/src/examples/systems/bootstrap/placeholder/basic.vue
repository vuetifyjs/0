<script setup lang="ts">
  import { BPlaceholder } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <div
      aria-hidden="true"
      class="placeholder-wave d-flex gap-2"
    >
      <BPlaceholder class="col-6" />
    </div>

    <div
      aria-hidden="true"
      class="placeholder-pulse d-flex gap-2"
    >
      <BPlaceholder class="col-12" />
    </div>

    <div
      aria-hidden="true"
      class="placeholder-glow d-flex gap-2"
    >
      <BPlaceholder class="col-12" size="lg" />
    </div>

    <div
      aria-hidden="true"
      class="d-flex gap-2"
    >
      <BPlaceholder class="col-12" size="sm" />
    </div>

    <div
      aria-hidden="true"
      class="d-flex gap-2"
    >
      <BPlaceholder class="col-12" size="xs" />
    </div>

    <div
      aria-hidden="true"
      class="d-flex gap-2"
    >
      <BPlaceholder class="w-75 bg-primary" />
    </div>
  </div>
</template>
