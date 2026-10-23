<script setup lang="ts">
  import { QuCard, QuToggleButtons } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const range = shallowRef('week')

  const totals: Record<string, string> = {
    day: '4,213 steps',
    week: '38,470 steps',
    month: '162,904 steps',
  }
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Title>{{ totals[range] }}</QuCard.Title>

      <QuCard.Subtitle>Activity for the selected range</QuCard.Subtitle>

      <QuCard.Actions>
        <QuToggleButtons v-model="range" label="Date range" mandatory>
          <QuToggleButtons.Item value="day">Day</QuToggleButtons.Item>

          <QuToggleButtons.Item value="week">Week</QuToggleButtons.Item>

          <QuToggleButtons.Item value="month">Month</QuToggleButtons.Item>
        </QuToggleButtons>
      </QuCard.Actions>
    </QuCard>
  </div>
</template>

<style>
  .quantum-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 344px));
    gap: var(--quantum-spacing-1, 8px);
    padding: var(--quantum-spacing-1, 8px);
    background: var(--quantum-background, #FAFAFA);
  }
</style>
