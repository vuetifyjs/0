<script setup lang="ts">
  import { QuButton, QuCard } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-cards">
    <QuCard>
      <QuCard.Title>Your trip to Lisbon</QuCard.Title>

      <QuCard.Subtitle>3 nights from Friday, 14 June</QuCard.Subtitle>

      <QuCard.Supporting>
        Your flight leaves at 7:40 AM from Terminal 2. Check in online from 24 hours before departure to choose a seat.
      </QuCard.Supporting>

      <QuCard.Actions>
        <QuButton>Check in</QuButton>

        <QuButton>Itinerary</QuButton>
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
