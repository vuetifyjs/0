<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  // Nothing to redo and nothing selected yet: those items stay in place, disabled.
  const history = shallowRef(0)
</script>

<template>
  <div class="md1-docs-menu-stack">
    <Md1Menu>
      <Md1Menu.Activator v-slot="{ attrs }">
        <Md1Button v-bind="attrs">Edit</Md1Button>
      </Md1Menu.Activator>

      <Md1Menu.Content>
        <Md1Menu.Item @select="history++">Undo</Md1Menu.Item>

        <Md1Menu.Item disabled>Redo</Md1Menu.Item>

        <Md1Menu.Divider />

        <Md1Menu.Item disabled>Cut</Md1Menu.Item>

        <Md1Menu.Item disabled>Copy</Md1Menu.Item>

        <Md1Menu.Item>Paste</Md1Menu.Item>
      </Md1Menu.Content>
    </Md1Menu>

    <p class="md1-docs-readout md1-docs-note" role="status">{{ history > 0 ? `Undone ${history}x` : 'Nothing undone' }}</p>
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
