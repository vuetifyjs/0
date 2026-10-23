<script setup lang="ts">
  import { QuButton, QuMenu, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="quantum-docs-settings-stack">
    <QuToolbar variant="primary">
      <QuToolbar.Title>Notes</QuToolbar.Title>

      <QuToolbar.Actions>
        <QuButton aria-label="Search" icon="search" />

        <QuMenu>
          <QuMenu.Activator v-slot="{ attrs }">
            <QuButton v-bind="attrs" aria-label="More options" icon="more-vert" />
          </QuMenu.Activator>

          <QuMenu.Content>
            <QuMenu.Item @select="chosen = 'Sort by date'">Sort by date</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Archive'">Archive</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Settings'">Settings</QuMenu.Item>

            <QuMenu.Item @select="chosen = 'Help & feedback'">Help & feedback</QuMenu.Item>
          </QuMenu.Content>
        </QuMenu>
      </QuToolbar.Actions>
    </QuToolbar>

    <span v-if="chosen" class="quantum-docs-settings-note" role="status">{{ chosen }}</span>
  </div>
</template>

<style>
  .quantum-docs-settings-stack {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    max-width: 360px;
  }

  .quantum-docs-settings-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
