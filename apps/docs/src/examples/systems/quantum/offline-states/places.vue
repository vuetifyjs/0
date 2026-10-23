<script setup lang="ts">
  import { createQuantumIconsContext, QuDivider, QuList, QuNavigationDrawer, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

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

  const page = shallowRef('offline')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-offline-drawer">
    <QuNavigationDrawer type="permanent">
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Item value="home">
            <QuList.Icon name="home" />

            Home
          </QuList.Item>

          <QuList.Item value="library">
            <QuList.Icon name="folder" />

            Library
          </QuList.Item>

          <QuList.Item value="offline">
            <QuList.Icon name="offline-pin" />

            Offline
          </QuList.Item>
        </QuList>

        <QuDivider />

        <QuList v-model="page">
          <QuList.Item value="settings">
            <QuList.Icon name="settings" />

            Settings
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-offline-column">
      <QuToolbar variant="primary">
        <QuToolbar.Title>{{ page === 'offline' ? 'Offline' : 'Music' }}</QuToolbar.Title>
      </QuToolbar>

      <p class="quantum-docs-offline-text" role="status">
        {{ page === 'offline' ? '3 albums and 12 episodes are on this device.' : `Current page: ${page}` }}
      </p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-offline-drawer {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-offline-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-docs-offline-text {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
