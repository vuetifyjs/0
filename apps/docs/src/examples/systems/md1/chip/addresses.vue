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

    <span class="md1-docs-note" role="status">Sending to {{ address }}</span>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
