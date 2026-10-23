<script setup lang="ts">
  import { createMd1IconsContext, Md1Divider, Md1List, Md1NavigationDrawer, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

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

  const page = shallowRef('offline')
</script>

<template>
  <div class="md1-docs-screen md1-docs-offline-drawer">
    <Md1NavigationDrawer type="permanent">
      <Md1NavigationDrawer.Content>
        <Md1List v-model="page">
          <Md1List.Item value="home">
            <Md1List.Icon name="home" />

            Home
          </Md1List.Item>

          <Md1List.Item value="library">
            <Md1List.Icon name="folder" />

            Library
          </Md1List.Item>

          <Md1List.Item value="offline">
            <Md1List.Icon name="offline-pin" />

            Offline
          </Md1List.Item>
        </Md1List>

        <Md1Divider />

        <Md1List v-model="page">
          <Md1List.Item value="settings">
            <Md1List.Icon name="settings" />

            Settings
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-offline-column">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Title>{{ page === 'offline' ? 'Offline' : 'Music' }}</Md1Toolbar.Title>
      </Md1Toolbar>

      <p class="md1-docs-offline-text" role="status">
        {{ page === 'offline' ? '3 albums and 12 episodes are on this device.' : `Current page: ${page}` }}
      </p>
    </div>
  </div>
</template>

<style>
  .md1-docs-offline-drawer {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  /* The content beside the drawer; on a frame too narrow for both it clips under the drawer's edge. */
  .md1-docs-offline-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-offline-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
