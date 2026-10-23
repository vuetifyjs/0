<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
  import { shallowRef } from 'vue'

  const panel = shallowRef('trip')
</script>

<template>
  <Md1ExpansionPanel v-model="panel" class="md1-docs-panels">
    <Md1ExpansionPanel.Item value="trip">
      <Md1ExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <Md1ExpansionPanel.Content>
        Seven nights from Miami, stopping in Nassau, St. Thomas and Barbados.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="location">
      <Md1ExpansionPanel.Header label="Location" summary="Barbados" />

      <Md1ExpansionPanel.Content>
        Bridgetown cruise terminal, a ten minute drive from the airport.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="travelers">
      <Md1ExpansionPanel.Header label="Travelers" summary="2 adults" />

      <Md1ExpansionPanel.Content>
        Both travelers share one cabin on deck 9.
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
