<script setup lang="ts">
  import { EmAlert, EmAlertDescription, EmAlertTitle } from '@paper/emerald'
</script>

<template>
  <EmAlert>
    <EmAlertTitle>Payment failed</EmAlertTitle>

    <EmAlertDescription>Your card was declined. No charge was made — check the card details and try again.</EmAlertDescription>
  </EmAlert>
</template>
