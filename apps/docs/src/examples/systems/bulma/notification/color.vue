<script setup lang="ts">
  import { BuNotification, BuNotificationDelete } from '@paper/bulma'
</script>

<template>
  <BuNotification class="mb-4" color="primary">
    <BuNotificationDelete />
    Primary — the brand color, for context with no action attached.
  </BuNotification>

  <BuNotification class="mb-4" color="info">
    <BuNotificationDelete />
    Info — supporting context. Put the meaning in the words, not the tint.
  </BuNotification>

  <BuNotification class="mb-4" color="success">
    <BuNotificationDelete />
    Success — a completed action. Dismisses the same way as the others.
  </BuNotification>

  <BuNotification class="mb-4" color="warning">
    <BuNotificationDelete />
    Warning — something will go wrong if ignored.
  </BuNotification>

  <BuNotification color="danger">
    <BuNotificationDelete />
    Danger — something failed and needs action.
  </BuNotification>
</template>
