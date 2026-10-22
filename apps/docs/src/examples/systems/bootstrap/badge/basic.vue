<script setup lang="ts">
  import { BBadge, BButton } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-2">
    <BBadge theme="primary">New</BBadge>

    <BBadge
      theme="primary"
      variant="subtle"
    >
      New
    </BBadge>

    <BBadge
      theme="primary"
      variant="outline"
    >
      New
    </BBadge>

    <BButton
      theme="primary"
      variant="solid"
    >
      Notifications
      <BBadge theme="danger">4</BBadge>
    </BButton>
  </div>
</template>
