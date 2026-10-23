<script setup lang="ts">
  import { QuExpansionPanel } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(['details', 'audience'])
</script>

<template>
  <QuExpansionPanel v-model="open" class="quantum-docs-panels" multiple>
    <QuExpansionPanel.Item value="details">
      <QuExpansionPanel.Header label="Campaign details" summary="Spring sale" />

      <QuExpansionPanel.Content>
        Runs from March 1 to March 31 with a daily budget of $40.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="audience">
      <QuExpansionPanel.Header label="Audience" summary="Returning customers" />

      <QuExpansionPanel.Content>
        Customers who bought in the last twelve months, in the United States and Canada.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="ads">
      <QuExpansionPanel.Header label="Ads" secondary="Add at least one" />

      <QuExpansionPanel.Content>
        No ads yet.
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
