<script setup lang="ts">
  import { Md1Button, Md1Card } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Title>Your trip to Lisbon</Md1Card.Title>

      <Md1Card.Subtitle>3 nights from Friday, 14 June</Md1Card.Subtitle>

      <Md1Card.Supporting>
        Your flight leaves at 7:40 AM from Terminal 2. Check in online from 24 hours before departure to choose a seat.
      </Md1Card.Supporting>

      <Md1Card.Actions>
        <Md1Button>Check in</Md1Button>

        <Md1Button>Itinerary</Md1Button>
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
