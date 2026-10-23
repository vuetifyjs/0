<script setup lang="ts">
  import { createMd1IconsContext, Md1Icon, Md1List } from '@paper/md1'

  // The pinned icon set has no offline-pin role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createMd1IconsPlugin({ icons }).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      // Material Icons action/offline_pin, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'offline-pin': ['M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,18H7v-2h10V18z M10.3,14L7,10.7l1.4-1.4l1.9,1.9 l5.3-5.3L17,7.3L10.3,14z'],
    },
  })

  provideIcons()

  const articles = [
    { id: 1, title: 'Twelve trails for a rainy weekend', source: 'Outdoors', saved: true },
    { id: 2, title: 'How bridges carry the wind', source: 'Engineering', saved: false },
    { id: 3, title: 'A slower way to make bread', source: 'Food', saved: true },
  ]
</script>

<template>
  <div class="md1-docs-offline-sheet">
    <Md1List :lines="2">
      <Md1List.Item v-for="article in articles" :key="article.id">
        <Md1List.Content>
          <Md1List.Primary>{{ article.title }}</Md1List.Primary>

          <Md1List.Secondary>{{ article.source }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action v-if="article.saved">
          <span class="md1-docs-offline-status">
            <Md1Icon class="md1-docs-offline-icon" name="offline-pin" />

            Offline
          </span>
        </Md1List.Action>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  .md1-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-offline-status {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offline-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
