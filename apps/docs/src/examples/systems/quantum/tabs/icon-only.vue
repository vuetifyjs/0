<script setup lang="ts">
  import { QuTabs } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const tab = shallowRef('inbox')
</script>

<template>
  <QuTabs v-model="tab">
    <QuTabs.List label="Mail">
      <QuTabs.Item aria-label="Inbox" icon="inbox" value="inbox" />

      <QuTabs.Item aria-label="Starred" icon="star" value="starred" />

      <QuTabs.Item aria-label="Sent" icon="send" value="sent" />
    </QuTabs.List>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="inbox">
      Inbox: 12 unread.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="starred">
      Starred: 3 conversations.
    </QuTabs.Panel>

    <QuTabs.Panel class="quantum-docs-tabs-panel" value="sent">
      Sent: nothing in the last week.
    </QuTabs.Panel>
  </QuTabs>
</template>

<style>
  .quantum-docs-tabs-panel {
    padding: var(--quantum-spacing-2, 16px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
  }
</style>
