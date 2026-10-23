<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
</script>

<template>
  <Md1ExpansionPanel class="md1-docs-panels">
    <Md1ExpansionPanel.Item value="notifications">
      <Md1ExpansionPanel.Header label="Notifications" summary="Daily digest" />

      <Md1ExpansionPanel.Content>
        One email a day with the changes to the trips you follow. Nothing is sent on days without changes.
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
