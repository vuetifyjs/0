<script setup lang="ts">
  import { Md1Button, Md1Menu, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-settings-stack">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Title>Notes</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Search" icon="search" />

        <Md1Menu>
          <Md1Menu.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
          </Md1Menu.Activator>

          <Md1Menu.Content>
            <Md1Menu.Item @select="chosen = 'Sort by date'">Sort by date</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Archive'">Archive</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Settings'">Settings</Md1Menu.Item>

            <Md1Menu.Item @select="chosen = 'Help & feedback'">Help & feedback</Md1Menu.Item>
          </Md1Menu.Content>
        </Md1Menu>
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <span v-if="chosen" class="md1-docs-settings-note" role="status">{{ chosen }}</span>
  </div>
</template>

<style>
  .md1-docs-settings-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }

  .md1-docs-settings-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
