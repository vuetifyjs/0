<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Fab } from '@paper/md1'

  const TRIPS = [
    { name: 'Lisbon', when: '3 nights from Friday' },
    { name: 'Porto', when: 'A weekend in May' },
    { name: 'Faro', when: '10 days in August' },
    { name: 'Sintra', when: 'A day trip' },
  ] as const
</script>

<template>
  <figure class="md1-docs-elevation-scroll">
    <div class="md1-docs-elevation-scroll-screen">
      <div aria-label="Trips, scrollable" class="md1-docs-elevation-scroll-content" tabindex="0">
        <Md1Card v-for="trip in TRIPS" :key="trip.name">
          <Md1Card.Title>{{ trip.name }}</Md1Card.Title>

          <Md1Card.Subtitle>{{ trip.when }}</Md1Card.Subtitle>

          <Md1Card.Actions>
            <Md1Button variant="raised">Book</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>

      <Md1Fab aria-label="Add trip" icon="add" />
    </div>

    <figcaption class="md1-docs-note">Scroll the cards: each raised button travels with the card it sits on, while the floating action button, whose parent is the screen, stays put</figcaption>
  </figure>
</template>

<style>
  .md1-docs-elevation-scroll {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
  }

  .md1-docs-elevation-scroll > figcaption {
    text-align: center;
  }

  /* A handset screen; containment makes it the fixed FAB's containing block. */
  .md1-docs-elevation-scroll-screen {
    position: relative;
    width: min(320px, 85vw);
    height: 360px;
    overflow: clip;
    contain: layout paint;
    background: var(--md1-background, #FAFAFA);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-elevation-scroll-content {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    height: 100%;
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-1, 8px) 88px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
