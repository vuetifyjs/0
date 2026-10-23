<script setup lang="ts">
  import { createMd1IconsContext, Md1Button, Md1Icon } from '@paper/md1'

  // In an app this is `app.use(createMd1IconsPlugin({ icons, aliases }))`.
  // An example cannot install a plugin, so it provides the same registry to
  // its own subtree through the context half of the trinity.
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      // Material Icons action/print, filled, 24px (Apache License 2.0)
      print: ['M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z'],
    },
    aliases: {
      printer: 'print',
    },
  })

  provideIcons()
</script>

<template>
  <div class="md1-docs-row">
    <Md1Icon class="md1-docs-icon-ink" name="print" />

    <Md1Icon class="md1-docs-icon-ink" name="printer" />

    <Md1Button icon="print">Print</Md1Button>
  </div>
</template>

<style>
  .md1-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
  }

  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
