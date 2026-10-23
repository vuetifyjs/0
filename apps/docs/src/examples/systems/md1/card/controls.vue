<script setup lang="ts">
  import { Md1Card, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef } from 'vue'

  const range = shallowRef('week')

  const totals: Record<string, string> = {
    day: '4,213 steps',
    week: '38,470 steps',
    month: '162,904 steps',
  }
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Title>{{ totals[range] }}</Md1Card.Title>

      <Md1Card.Subtitle>Activity for the selected range</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1ToggleButtons v-model="range" label="Date range" mandatory>
          <Md1ToggleButtons.Item value="day">Day</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="week">Week</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="month">Month</Md1ToggleButtons.Item>
        </Md1ToggleButtons>
      </Md1Card.Actions>
    </Md1Card>
  </div>
</template>

<style>
  .md1-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }
</style>
