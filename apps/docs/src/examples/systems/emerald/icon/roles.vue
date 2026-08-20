<script setup lang="ts">
  import { EmIcon, emeraldIcons } from '@paper/emerald'

  import type { EmIconName } from '@paper/emerald'

  const roles = Object.keys(emeraldIcons).toSorted() as EmIconName[]
</script>

<template>
  <ul class="emerald-docs-gallery">
    <li v-for="role in roles" :key="role" class="emerald-docs-glyph">
      <EmIcon :name="role" size="l" />

      <code>{{ role }}</code>
    </li>
  </ul>
</template>

<style>
  .emerald-docs-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
    gap: var(--emerald-spacing-xs, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .emerald-docs-glyph {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
    padding: var(--emerald-spacing-s, 12px) var(--emerald-spacing-2xs, 4px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-divider);
    border-radius: var(--emerald-radius-m, 8px);
    color: var(--emerald-on-surface);
  }

  .emerald-docs-glyph code {
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant);
    text-align: center;
    overflow-wrap: anywhere;
  }
</style>
