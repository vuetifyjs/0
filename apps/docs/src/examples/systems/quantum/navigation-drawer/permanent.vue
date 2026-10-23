<script setup lang="ts">
  import { QuDivider, QuList, QuNavigationDrawer, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
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

          <QuList.Group icon="label" title="Labels">
            <QuList.Item value="family">Family</QuList.Item>

            <QuList.Item value="work">Work</QuList.Item>
          </QuList.Group>
        </QuList>

        <QuDivider />

        <QuList v-model="page">
          <QuList.Item value="settings">
            <QuList.Icon name="settings" />

            Settings
          </QuList.Item>

          <QuList.Item value="help">
            <QuList.Icon name="help" />

            Help
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-drawer-column">
      <QuToolbar variant="primary">
        <QuToolbar.Title>Mail</QuToolbar.Title>
      </QuToolbar>

      <p class="quantum-docs-drawer-text" role="status">Current page: {{ page }}</p>
    </div>
  </div>
</template>

<style>
  .quantum-docs-drawer-screen {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .quantum-docs-drawer-text {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
