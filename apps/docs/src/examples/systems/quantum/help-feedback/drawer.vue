<script setup lang="ts">
  import { createQuantumIconsContext, QuDivider, QuList, QuNavigationDrawer, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  // The pinned icon set has no feedback role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createQuantumIconsPlugin({ icons }).
  const [, provideIcons] = createQuantumIconsContext({
    icons: {
      // Material Icons action/feedback, filled, 24px, commit 49d4db35 (Apache License 2.0)
      feedback: ['M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z'],
    },
  })

  provideIcons()

  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-help-drawer">
    <QuNavigationDrawer type="permanent">
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Item value="inbox">
            <QuList.Icon name="inbox" />

            Inbox
          </QuList.Item>

          <QuList.Item value="sent">
            <QuList.Icon name="send" />

            Sent mail
          </QuList.Item>
        </QuList>

        <QuDivider />

        <QuList v-model="page">
          <QuList.Item value="settings">
            <QuList.Icon name="settings" />

            Settings
          </QuList.Item>

          <QuList.Item value="feedback">
            <QuList.Icon name="feedback" />

            Send feedback
          </QuList.Item>

          <QuList.Item value="help">
            <QuList.Icon name="help" />

            Help
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-help-column">
      <QuToolbar variant="primary">
        <QuToolbar.Title>Mail</QuToolbar.Title>
      </QuToolbar>

      <p class="quantum-docs-help-body" role="status">Current page: {{ page }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-help-drawer {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-help-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-docs-help-body {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
