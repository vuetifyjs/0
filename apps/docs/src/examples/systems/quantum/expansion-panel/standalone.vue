<script setup lang="ts">
  import { QuExpansionPanel } from '@paper/quantum'
</script>

<template>
  <QuExpansionPanel class="quantum-docs-panels">
    <QuExpansionPanel.Item value="notifications">
      <QuExpansionPanel.Header label="Notifications" summary="Daily digest" />

      <QuExpansionPanel.Content>
        One email a day with the changes to the trips you follow. Nothing is sent on days without changes.
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
