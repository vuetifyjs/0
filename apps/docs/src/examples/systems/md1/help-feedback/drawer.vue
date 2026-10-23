<script setup lang="ts">
  import { createMd1IconsContext, Md1Divider, Md1List, Md1NavigationDrawer, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  // The pinned icon set has no feedback role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createMd1IconsPlugin({ icons }).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      // Material Icons action/feedback, filled, 24px, commit 49d4db35 (Apache License 2.0)
      feedback: ['M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z'],
    },
  })

  provideIcons()

  const page = shallowRef('inbox')
</script>

<template>
  <div class="md1-docs-screen md1-docs-help-drawer">
    <Md1NavigationDrawer type="permanent">
      <Md1NavigationDrawer.Content>
        <Md1List v-model="page">
          <Md1List.Item value="inbox">
            <Md1List.Icon name="inbox" />

            Inbox
          </Md1List.Item>

          <Md1List.Item value="sent">
            <Md1List.Icon name="send" />

            Sent mail
          </Md1List.Item>
        </Md1List>

        <Md1Divider />

        <Md1List v-model="page">
          <Md1List.Item value="settings">
            <Md1List.Icon name="settings" />

            Settings
          </Md1List.Item>

          <Md1List.Item value="feedback">
            <Md1List.Icon name="feedback" />

            Send feedback
          </Md1List.Item>

          <Md1List.Item value="help">
            <Md1List.Icon name="help" />

            Help
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-help-column">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Title>Mail</Md1Toolbar.Title>
      </Md1Toolbar>

      <p class="md1-docs-help-body" role="status">Current page: {{ page }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-help-drawer {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-help-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .md1-docs-help-body {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
