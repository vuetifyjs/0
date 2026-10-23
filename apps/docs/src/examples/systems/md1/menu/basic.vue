<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-row">
    <Md1Menu>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs" aria-label="More options" icon="more-vert" />
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item @select="chosen = 'Refresh'">Refresh</Md1Menu.Item>

        <Md1Menu.Item @select="chosen = 'Settings'">Settings</Md1Menu.Item>

        <Md1Menu.Item @select="chosen = 'Help'">Help</Md1Menu.Item>

        <Md1Menu.Item @select="chosen = 'Send feedback'">Send feedback</Md1Menu.Item>

        <Md1Menu.Item @select="chosen = 'Sign out'">Sign out</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>

    <span v-if="chosen" class="md1-docs-note" role="status">{{ chosen }}</span>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
