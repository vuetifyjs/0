<script setup lang="ts">
  import { BuNotification } from '@paper/bulma'
</script>

<template>
  <BuNotification class="mb-4" color="primary">
    <BuNotification.Delete />
    Primary — the brand color, for context with no action attached.
  </BuNotification>

  <BuNotification class="mb-4" color="info">
    <BuNotification.Delete />
    Info — supporting context. Put the meaning in the words, not the tint.
  </BuNotification>

  <BuNotification class="mb-4" color="success">
    <BuNotification.Delete />
    Success — a completed action. Dismisses the same way as the others.
  </BuNotification>

  <BuNotification class="mb-4" color="warning">
    <BuNotification.Delete />
    Warning — something will go wrong if ignored.
  </BuNotification>

  <BuNotification color="danger">
    <BuNotification.Delete />
    Danger — something failed and needs action.
  </BuNotification>
</template>
