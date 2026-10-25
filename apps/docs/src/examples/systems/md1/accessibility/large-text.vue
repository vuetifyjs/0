<script setup lang="ts">
  import { Md1Button, Md1Card, Md1List, Md1Toolbar, Md1ToggleButtons } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const scale = shallowRef('100')
  // Browser zoom and magnification scale CSS pixels, so the screen keeps its
  // physical width and its content gets fewer pixels to lay out in.
  const zoom = toRef(() => Number(scale.value) / 100)
</script>

<template>
  <div class="md1-docs-a11y-stack">
    <Md1ToggleButtons v-model="scale" label="Magnification" mandatory>
      <Md1ToggleButtons.Item value="100">100%</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="150">150%</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="200">200%</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <div class="md1-docs-screen md1-docs-a11y-large-screen">
      <div class="md1-docs-a11y-large-content" :style="{ zoom }">
        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Title>Reservation details</Md1Toolbar.Title>
        </Md1Toolbar>

        <div class="md1-docs-a11y-large-body">
          <Md1Card>
            <Md1Card.Title>Casa do Largo</Md1Card.Title>

            <Md1Card.Subtitle>Three nights from Friday 14 June</Md1Card.Subtitle>

            <Md1Card.Actions>
              <Md1Button>Directions</Md1Button>

              <Md1Button>Call the hotel</Md1Button>
            </Md1Card.Actions>
          </Md1Card>

          <Md1List aria-label="Reservation" :lines="2">
            <Md1List.Item>
              <Md1List.Icon name="event" />

              <Md1List.Content>
                <Md1List.Primary>Check in from 15:00</Md1List.Primary>

                <Md1List.Secondary>Friday 14 June</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-a11y-large-screen {
    width: 100%;
    max-width: 360px;
    height: 440px;
    outline: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    background: var(--md1-background, #FAFAFA);
  }

  /* The content is laid out in what is left after magnification, and scrolls rather than overlaps. */
  .md1-docs-a11y-large-content {
    height: 100%;
    overflow-y: auto;
  }

  .md1-docs-a11y-large-body {
    padding: var(--md1-spacing-1, 8px);
  }
</style>
