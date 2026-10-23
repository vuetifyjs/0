<script setup lang="ts">
  import { Md1Icon, md1IconAliases, md1Icons } from '@paper/md1'

  import type { Md1IconName } from '@paper/md1'

  // Invert the alias table so each drawing lists every name that reaches it.
  const names = new Map<string, string[]>()

  for (const [alias, target] of Object.entries(md1IconAliases)) {
    const role = target.slice(1, -1)

    names.set(role, [...(names.get(role) ?? []), alias])
  }

  const roles = (Object.keys(md1Icons) as Md1IconName[]).map(name => ({
    name,
    aliases: names.get(name) ?? [],
  }))
</script>

<template>
  <ul class="md1-docs-icon-gallery">
    <li v-for="role in roles" :key="role.name" class="md1-docs-icon-tile">
      <Md1Icon class="md1-docs-icon-ink" :name="role.name" />

      <span class="md1-docs-icon-name">{{ role.name }}</span>

      <span v-if="role.aliases.length > 0" class="md1-docs-icon-aliases">
        {{ role.aliases.join(', ') }}
      </span>
    </li>
  </ul>
</template>

<style>
  .md1-docs-icon-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--md1-spacing-1, 8px);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .md1-docs-icon-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: var(--md1-spacing-2, 16px) 4px;
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--md1-radius, 2px);
    text-align: center;
  }

  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-icon-name {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-weight: var(--md1-font-weight-medium, 500);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    overflow-wrap: anywhere;
  }

  .md1-docs-icon-aliases {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    overflow-wrap: anywhere;
  }
</style>
