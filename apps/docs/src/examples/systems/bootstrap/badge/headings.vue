<script setup lang="ts">
  import { BBadge } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column align-items-start gap-3">
    <h1 class="mb-0">Heading <BBadge>New</BBadge></h1>

    <h3 class="mb-0">Heading <BBadge>New</BBadge></h3>

    <BBadge
      as="a"
      href="#inbox"
      theme="primary"
    >
      Inbox
    </BBadge>
  </div>
</template>
