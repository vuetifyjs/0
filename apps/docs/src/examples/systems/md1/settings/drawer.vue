<script setup lang="ts">
  import { Md1Divider, Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
</script>

<template>
  <div class="md1-docs-screen md1-docs-settings-drawer-screen">
    <Md1NavigationDrawer aria-label="Mail" type="permanent">
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

          <Md1List.Item value="drafts">
            <Md1List.Icon name="drafts" />

            Drafts
          </Md1List.Item>
        </Md1List>

        <Md1Divider />

        <Md1List v-model="page">
          <Md1List.Item value="settings">
            <Md1List.Icon name="settings" />

            Settings
          </Md1List.Item>

          <Md1List.Item value="help">
            <Md1List.Icon name="help" />

            Help & feedback
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <p class="md1-docs-settings-text" role="status">Current page: {{ page }}</p>
  </div>
</template>

<style>
  .md1-docs-settings-drawer-screen {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-settings-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
