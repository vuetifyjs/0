<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
</script>

<template>
  <Md1ExpansionPanel class="md1-docs-panels">
    <Md1ExpansionPanel.Item value="trip">
      <Md1ExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <Md1ExpansionPanel.Content>
        The name shown on the itinerary.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item disabled value="payment">
      <Md1ExpansionPanel.Header label="Payment" summary="Paid in full" />

      <Md1ExpansionPanel.Content>
        Payment is locked once the trip is paid.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>
  </Md1ExpansionPanel>
</template>

<style>
  .md1-docs-panels {
    width: 100%;
    max-width: 640px;
  }
</style>
