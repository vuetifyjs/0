<script setup lang="ts">
  import { QuIcon, quantumIconAliases, quantumIcons } from '@paper/quantum'

  import type { QuIconName } from '@paper/quantum'

  // Invert the alias table so each drawing lists every name that reaches it.
  const names = new Map<string, string[]>()

  for (const [alias, target] of Object.entries(quantumIconAliases)) {
    const role = target.slice(1, -1)

    names.set(role, [...(names.get(role) ?? []), alias])
  }

  const roles = (Object.keys(quantumIcons) as QuIconName[]).map(name => ({
    name,
    aliases: names.get(name) ?? [],
  }))
</script>

<template>
  <ul class="quantum-docs-icon-gallery">
    <li v-for="role in roles" :key="role.name" class="quantum-docs-icon-tile">
      <QuIcon class="quantum-docs-icon-ink" :name="role.name" />

      <span class="quantum-docs-icon-name">{{ role.name }}</span>

      <span v-if="role.aliases.length > 0" class="quantum-docs-icon-aliases">
        {{ role.aliases.join(', ') }}
      </span>
    </li>
  </ul>
</template>

<style>
  .quantum-docs-icon-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--quantum-spacing-1, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .quantum-docs-icon-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--quantum-spacing-2, 16px) 4px;
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--quantum-radius, 2px);
    text-align: center;
  }

  .quantum-docs-icon-ink {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-icon-name {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-weight: var(--quantum-font-weight-medium, 500);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    overflow-wrap: anywhere;
  }

  .quantum-docs-icon-aliases {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    overflow-wrap: anywhere;
  }
</style>
