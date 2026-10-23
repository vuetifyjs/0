<script setup lang="ts">
  import { QuExpansionPanel } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const panel = shallowRef('trip')
</script>

<template>
  <QuExpansionPanel v-model="panel" class="quantum-docs-panels">
    <QuExpansionPanel.Item value="trip">
      <QuExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <QuExpansionPanel.Content>
        Seven nights from Miami, stopping in Nassau, St. Thomas and Barbados.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="location">
      <QuExpansionPanel.Header label="Location" summary="Barbados" />

      <QuExpansionPanel.Content>
        Bridgetown cruise terminal, a ten minute drive from the airport.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="travelers">
      <QuExpansionPanel.Header label="Travelers" summary="2 adults" />

      <QuExpansionPanel.Content>
        Both travelers share one cabin on deck 9.
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
