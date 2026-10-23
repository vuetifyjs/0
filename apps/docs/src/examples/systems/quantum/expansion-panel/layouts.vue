<script setup lang="ts">
  import { QuExpansionPanel } from '@paper/quantum'
</script>

<template>
  <QuExpansionPanel class="quantum-docs-panels">
    <QuExpansionPanel.Item value="name">
      <QuExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <QuExpansionPanel.Content>
        The name shown on the itinerary and the boarding passes.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="dates">
      <QuExpansionPanel.Header label="Dates">
        <span class="quantum-docs-panel-values">
          <span>Start date: Feb 29, 2016</span>

          <span>End date: Not set</span>
        </span>
      </QuExpansionPanel.Header>

      <QuExpansionPanel.Content>
        Pick the end date once the return flight is booked.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>

    <QuExpansionPanel.Item value="meals">
      <QuExpansionPanel.Header label="Meal preferences" secondary="Optional" />

      <QuExpansionPanel.Content>
        Dietary needs are passed to the dining room before departure.
      </QuExpansionPanel.Content>
    </QuExpansionPanel.Item>
  </QuExpansionPanel>
</template>

<style>
  .quantum-docs-panels {
    width: 100%;
    max-width: 640px;
  }

  /* Two labelled values side by side in the value column, 16 dp apart (figure spec2's column gap). */
  .quantum-docs-panel-values {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--quantum-spacing-2, 16px);
  }
</style>
