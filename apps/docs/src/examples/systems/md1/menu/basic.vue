<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  const chosen = shallowRef<string>()
</script>

<template>
  <div class="md1-docs-menu-stack">
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

    <p class="md1-docs-readout md1-docs-note" role="status">{{ chosen ?? 'Nothing chosen' }}</p>
  </div>
</template>

<style>
  /*
   * The menu button on top and its readout below, each centred on its own, so
   * the readout changing never moves the button.
   */
  .md1-docs-menu-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
