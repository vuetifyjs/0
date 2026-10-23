<script setup lang="ts">
  import { QuDivider, QuList, QuNavigationDrawer } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-settings-drawer-screen">
    <QuNavigationDrawer aria-label="Mail" type="permanent">
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

          <QuList.Item value="drafts">
            <QuList.Icon name="drafts" />

            Drafts
          </QuList.Item>
        </QuList>

        <QuDivider />

        <QuList v-model="page">
          <QuList.Item value="settings">
            <QuList.Icon name="settings" />

            Settings
          </QuList.Item>

          <QuList.Item value="help">
            <QuList.Icon name="help" />

            Help & feedback
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <p class="quantum-docs-settings-text" role="status">Current page: {{ page }}</p>
  </div>
</template>

<style>
  .quantum-docs-settings-drawer-screen {
    display: flex;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-settings-text {
    flex: 1 1 auto;
    min-width: 0;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
