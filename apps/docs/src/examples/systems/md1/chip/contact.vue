<script setup lang="ts">
  import { Md1Chip } from '@paper/md1'

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
  <div class="md1-docs-field">
    <span class="md1-docs-field-label">To</span>

    <Md1Chip
      v-for="contact in recipients"
      :key="contact.name"
      :avatar="contact.avatar"
      contact
      deletable
      @delete="onDelete(contact.name)"
    >
      {{ contact.name }}
    </Md1Chip>
  </div>
</template>

<style>
  /*
   * A "To" field: 16 dp of padding around a 40 dp line, so a resting 32 dp
   * contact chip sits 20 dp from either edge and a focused 40 dp one 16 dp,
   * and the 72 dp row holds still while the chip grows.
   */
  .md1-docs-field {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    box-sizing: content-box;
    min-height: 40px;
    max-width: 560px;
    padding-block: var(--md1-spacing-2, 16px);
    border-bottom: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-field-label {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
  }
</style>
