<script setup lang="ts">
  import BrokenTicket from './footgun-ticket-mutation-broken.vue'
  import WorkingTicket from './footgun-ticket-mutation-working.vue'
</script>

<template>
  <div class="grid grid-cols-2 gap-4">
    <BrokenTicket />
    <WorkingTicket />
  </div>
</template>
