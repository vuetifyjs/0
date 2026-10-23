<script setup lang="ts">
  import { Md1Button, Md1Menu } from '@paper/md1'

  import { shallowRef } from 'vue'

  // Nothing to redo and nothing selected yet: those items stay in place, disabled.
  const history = shallowRef(0)
</script>

<template>
  <div class="md1-docs-row">
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

    <span v-if="history > 0" class="md1-docs-note" role="status">Undone {{ history }}x</span>
  </div>
</template>

<style>
  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
