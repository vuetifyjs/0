<script setup lang="ts">
  import { Md1Chip } from '@paper/md1'

  import { shallowRef } from 'vue'

  const ADDRESSES = ['alice@example.com', 'a.jones@work.example', '+1 416 555 0134']

  // A docs-only stand-in for the contact photo: a palette swatch with an initial.
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#3F51B5"/><text x="20" y="26" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="18" text-anchor="middle">A</text></svg>'
  const avatar = `data:image/svg+xml,${encodeURIComponent(svg)}`

  const address = shallowRef(ADDRESSES[0])
</script>

<template>
  <div class="md1-docs-stack">
    <div class="md1-docs-chip-addresses">
      <Md1Chip :avatar contact>
        Alice Jones

        <Md1Chip.Addresses>
          <Md1Chip.Address
            v-for="item in ADDRESSES"
            :key="item"
            :active="item === address"
            @click="address = item"
          >
            {{ item }}
          </Md1Chip.Address>
        </Md1Chip.Addresses>
      </Md1Chip>
    </div>

    <p class="md1-docs-readout md1-docs-note" role="status">Sending to {{ address }}</p>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /*
   * The room the open sheet takes: 280 dp wide and 200 dp tall (the 72 dp
   * heading, three 40 dp rows and 8 dp below them), plus room for its 8 dp
   * shadow. The resting 32 dp chip sits where the sheet's photo opens over it,
   * the margin keyline plus half the photo, less half the chip, in from the
   * start and the top, so the open sheet stays inside the panel and neither it
   * nor the readout below moves the chip.
   */
  .md1-docs-chip-addresses {
    box-sizing: border-box;
    inline-size: 280px;
    max-inline-size: 100%;
    min-block-size: 224px;
    padding-block-start: calc(var(--md1-spacing-2, 16px) + var(--md1-avatar-size, 40px) / 2 - 16px);
    padding-inline-start: calc(var(--md1-keyline-margin, 16px) + var(--md1-avatar-size, 40px) / 2 - 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
