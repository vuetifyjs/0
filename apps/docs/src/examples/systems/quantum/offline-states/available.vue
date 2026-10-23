<script setup lang="ts">
  import { createQuantumIconsContext, QuIcon, QuList } from '@paper/quantum'

  // The pinned icon set has no offline-pin role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createQuantumIconsPlugin({ icons }).
  const [, provideIcons] = createQuantumIconsContext({
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
  <div class="quantum-docs-offline-sheet">
    <QuList :lines="2">
      <QuList.Item v-for="article in articles" :key="article.id">
        <QuList.Content>
          <QuList.Primary>{{ article.title }}</QuList.Primary>

          <QuList.Secondary>{{ article.source }}</QuList.Secondary>
        </QuList.Content>

        <QuList.Action v-if="article.saved">
          <span class="quantum-docs-offline-status">
            <QuIcon class="quantum-docs-offline-icon" name="offline-pin" />

            Offline
          </span>
        </QuList.Action>
      </QuList.Item>
    </QuList>
  </div>
</template>

<style>
  .quantum-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2);
  }

  .quantum-docs-offline-status {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offline-icon {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
