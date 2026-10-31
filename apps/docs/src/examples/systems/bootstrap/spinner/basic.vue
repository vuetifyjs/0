<script setup lang="ts">
  import { BBadge, BButton, BSpinner } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <BSpinner>Loading…</BSpinner>

    <BBadge theme="primary">
      <BSpinner aria-hidden="true" />
      <span role="status">Loading</span>
    </BBadge>

    <BButton
      disabled
      theme="primary"
      variant="subtle"
    >
      <BSpinner aria-hidden="true" />
      <span role="status">Loading…</span>
    </BButton>
  </div>
</template>
