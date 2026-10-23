<script setup lang="ts">
  import { QuExpansionPanel } from '@paper/quantum'
</script>

<template>
  <QuExpansionPanel class="quantum-docs-panels">
    <QuExpansionPanel.Item value="trip">
      <QuExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <QuExpansionPanel.Content>
        The name shown on the itinerary.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item disabled value="payment">
      <QuExpansionPanel.Header label="Payment" summary="Paid in full" />

      <QuExpansionPanel.Content>
        Payment is locked once the trip is paid.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>
  </QuExpansionPanel>
</template>

<style>
  .quantum-docs-panels {
    width: 100%;
    max-width: 640px;
  }
</style>
