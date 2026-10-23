<script setup lang="ts">
  import { Md1ExpansionPanel } from '@paper/md1'
</script>

<template>
  <Md1ExpansionPanel class="md1-docs-panels">
    <Md1ExpansionPanel.Item value="name">
      <Md1ExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />

      <Md1ExpansionPanel.Content>
        The name shown on the itinerary and the boarding passes.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="dates">
      <Md1ExpansionPanel.Header label="Dates">
        <span class="md1-docs-panel-values">
          <span>Start date: Feb 29, 2016</span>

          <span>End date: Not set</span>
        </span>
      </Md1ExpansionPanel.Header>

      <Md1ExpansionPanel.Content>
        Pick the end date once the return flight is booked.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>

    <Md1ExpansionPanel.Item value="meals">
      <Md1ExpansionPanel.Header label="Meal preferences" secondary="Optional" />

      <Md1ExpansionPanel.Content>
        Dietary needs are passed to the dining room before departure.
      </Md1ExpansionPanel.Content>
    </Md1ExpansionPanel.Item>
  </Md1ExpansionPanel>
</template>

<style>
  .md1-docs-panels {
    width: 100%;
    max-width: 640px;
  }

  /* Two labelled values side by side in the value column, 16 dp apart (figure spec2's column gap). */
  .md1-docs-panel-values {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--md1-spacing-2, 16px);
  }
</style>
