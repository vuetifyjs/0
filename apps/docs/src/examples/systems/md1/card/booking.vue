<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Divider, Md1Icon, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef } from 'vue'

  const time = shallowRef('7:30')
  const reserved = shallowRef(false)
</script>

<template>
  <div class="md1-docs-cards">
    <Md1Card>
      <Md1Card.Media src="https://picsum.photos/seed/md1-card-basil/688/387" />

      <Md1Card.Title>Cafe Basilico</Md1Card.Title>

      <div class="md1-docs-card-place md1-type-body-1">
        <span class="md1-docs-card-rating">
          <span aria-hidden="true" class="md1-docs-card-stars">
            <Md1Icon v-for="star in 5" :key="star" name="star" size="s" />
          </span>

          <span>4.7 (51 reviews)</span>
        </span>

        <span>$ · Italian, Cafe</span>

        <span class="md1-docs-card-secondary">Small plates, salads and sandwiches in an intimate setting with 12 indoor seats plus patio seating.</span>
      </div>

      <Md1Divider class="md1-docs-card-inset" />

      <Md1Card.Subtitle>Tonight's availability</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1ToggleButtons v-model="time" label="Reservation time" mandatory>
          <Md1ToggleButtons.Item value="5:30">5:30 PM</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="7:30">7:30 PM</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="9:00">9:00 PM</Md1ToggleButtons.Item>
        </Md1ToggleButtons>
      </Md1Card.Actions>

      <Md1Card.Actions>
        <Md1Button @click="reserved = true">Reserve</Md1Button>

        <span v-if="reserved" class="md1-docs-card-secondary md1-type-caption" role="status">Table held for {{ time }} PM</span>
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

  /* The place details on the content keyline, under the title. */
  .md1-docs-card-place {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 0 var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-card-rating {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-card-stars {
    display: inline-flex;
    color: var(--md1-accent, #FF4081);
  }

  .md1-docs-card-secondary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* An inset divider held on the card's content keyline at both edges, separating related sections. */
  .md1-docs-card-inset {
    margin-inline: var(--md1-keyline-margin, 16px);
  }
</style>
