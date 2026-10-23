<script setup lang="ts">
  import { QuChip } from '@paper/quantum'

  import { ref } from 'vue'

  interface Contact {
    name: string
    avatar: string
  }

  // Docs-only stand-ins for contact photos: a palette swatch with an initial.
  function photo (initial: string, fill: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${fill}"/><text x="20" y="26" fill="#FFFFFF" font-family="Roboto, sans-serif" font-size="18" text-anchor="middle">${initial}</text></svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  const recipients = ref<Contact[]>([
    { name: 'Alice Jones', avatar: photo('A', '#3F51B5') },
    { name: 'Ben Okafor', avatar: photo('B', '#009688') },
    { name: 'Chloe Martin', avatar: photo('C', '#E91E63') },
  ])

  function onDelete (name: string) {
    recipients.value = recipients.value.filter(contact => contact.name !== name)
  }
</script>

<template>
  <div class="quantum-docs-field">
    <span class="quantum-docs-field-label">To</span>

    <QuChip
      v-for="contact in recipients"
      :key="contact.name"
      :avatar="contact.avatar"
      contact
      deletable
      @delete="onDelete(contact.name)"
    >
      {{ contact.name }}
    </QuChip>
  </div>
</template>

<style>
  /*
   * A "To" field: 16 dp of padding around a 40 dp line, so a resting 32 dp
   * contact chip sits 20 dp from either edge and a focused 40 dp one 16 dp,
   * and the 72 dp row holds still while the chip grows.
   */
  .quantum-docs-field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    box-sizing: content-box;
    min-height: 40px;
    max-width: 560px;
    padding-block: var(--quantum-spacing-2, 16px);
    border-bottom: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-field-label {
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
  }
</style>
