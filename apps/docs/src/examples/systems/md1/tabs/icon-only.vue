<script setup lang="ts">
  import { Md1Tabs } from '@paper/md1'
  import { shallowRef } from 'vue'

  const tab = shallowRef('inbox')
</script>

<template>
  <Md1Tabs v-model="tab">
    <Md1Tabs.List label="Mail">
      <Md1Tabs.Item aria-label="Inbox" icon="inbox" value="inbox" />

      <Md1Tabs.Item aria-label="Starred" icon="star" value="starred" />

      <Md1Tabs.Item aria-label="Sent" icon="send" value="sent" />
    </Md1Tabs.List>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="inbox">
      Inbox: 12 unread.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="starred">
      Starred: 3 conversations.
    </Md1Tabs.Panel>

    <Md1Tabs.Panel class="md1-docs-tabs-panel" value="sent">
      Sent: nothing in the last week.
    </Md1Tabs.Panel>
  </Md1Tabs>
</template>

<style>
  .md1-docs-tabs-panel {
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }
</style>
