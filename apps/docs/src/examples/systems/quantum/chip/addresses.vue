<script setup lang="ts">
  import { QuChip } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const ADDRESSES = ['alice@example.com', 'a.jones@work.example', '+1 416 555 0134']

  // A docs-only stand-in for the contact photo: a palette swatch with an initial.
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#3F51B5"/><text x="20" y="26" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="18" text-anchor="middle">A</text></svg>'
  const avatar = `data:image/svg+xml,${encodeURIComponent(svg)}`

  const address = shallowRef(ADDRESSES[0])
</script>

<template>
  <div class="quantum-docs-stack">
    <QuChip :avatar contact>
      Alice Jones

      <QuChip.Addresses>
        <QuChip.Address
          v-for="item in ADDRESSES"
          :key="item"
          :active="item === address"
          @click="address = item"
        >
          {{ item }}
        </QuChip.Address>
      </QuChip.Addresses>
    </QuChip>

    <span class="quantum-docs-note" role="status">Sending to {{ address }}</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
