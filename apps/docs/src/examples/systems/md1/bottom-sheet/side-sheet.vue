<script setup lang="ts">
  import { Md1Button, Md1List } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-map md1-docs-sheet-desktop">
    <Md1Button
      aria-label="Dandelion Chocolate"
      class="md1-docs-sheet-pin"
      icon="place"
      @click="open = !open"
    />

    <aside v-if="open" aria-label="Dandelion Chocolate" class="md1-docs-sheet-side md1-elevation-2">
      <div class="md1-docs-sheet-place-head">
        <span class="md1-type-headline">Dandelion Chocolate</span>

        <span class="md1-docs-sheet-secondary md1-type-body-1">4.7 (51 reviews) · Chocolate shop</span>

        <span class="md1-docs-sheet-eta md1-type-body-1">12 min away</span>
      </div>

      <Md1List aria-label="Place details" dense>
        <Md1List.Item>
          <Md1List.Icon name="place" />

          <Md1List.Content>
            <Md1List.Primary>740 Valencia St, San Francisco</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Icon name="phone" />

          <Md1List.Content>
            <Md1List.Primary>(415) 349-0942</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Icon name="schedule" />

          <Md1List.Content>
            <Md1List.Primary>Wed, 10 AM – 9 PM</Md1List.Primary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <div class="md1-docs-sheet-side-actions">
        <Md1Button @click="open = false">Close</Md1Button>
      </div>
    </aside>
  </div>
</template>

<style>
  /* A stand-in map: the background with a street grid drawn in the divider ink. */
  .md1-docs-sheet-map {
    height: 480px;
    background-color: var(--md1-background, #FAFAFA);
    background-image:
      linear-gradient(var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px),
      linear-gradient(90deg, var(--md1-divider, rgba(0, 0, 0, 0.12)) 2px, transparent 2px),
      linear-gradient(35deg, transparent 49%, var(--md1-divider, rgba(0, 0, 0, 0.12)) 49%, var(--md1-divider, rgba(0, 0, 0, 0.12)) 51%, transparent 51%);
    background-size: 64px 64px, 64px 64px, 100% 100%;
  }

  .md1-docs-sheet-pin {
    position: absolute;
    top: 64px;
    left: 50%;
    color: var(--md1-accent, #FF4081);
    transform: translateX(-50%);
  }

  .md1-docs-sheet-place-head {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  .md1-docs-sheet-secondary {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-sheet-eta {
    color: var(--md1-primary, #3F51B5);
  }

  /* On desktop the details move onto their own sheet, on the left of the map, 8 dp from its edges. */
  .md1-docs-sheet-side {
    position: absolute;
    inset-block: var(--md1-spacing-1, 8px) auto;
    inset-inline-start: var(--md1-spacing-1, 8px);
    box-sizing: border-box;
    width: min(360px, calc(100% - 2 * var(--md1-spacing-1, 8px)));
    max-height: calc(100% - 2 * var(--md1-spacing-1, 8px));
    overflow-y: auto;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-sheet-side-actions {
    display: flex;
    justify-content: flex-end;
    padding: var(--md1-spacing-1, 8px);
  }
</style>
