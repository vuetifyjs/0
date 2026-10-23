<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(['details', 'audience'])
</script>

<template>
  <Md1ExpansionPanel v-model="open" class="md1-docs-panels" multiple>
    <Md1ExpansionPanel.Item value="details">
      <Md1ExpansionPanel.Header label="Campaign details" summary="Spring sale" />

      <Md1ExpansionPanel.Content>
        Runs from March 1 to March 31 with a daily budget of $40.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="audience">
      <Md1ExpansionPanel.Header label="Audience" summary="Returning customers" />

      <Md1ExpansionPanel.Content>
        Customers who bought in the last twelve months, in the United States and Canada.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="ads">
      <Md1ExpansionPanel.Header label="Ads" secondary="Add at least one" />

      <Md1ExpansionPanel.Content>
        No ads yet.
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
