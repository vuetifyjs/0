<script setup lang="ts">
  import { QuDivider, QuList, QuNavigationDrawer, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const titles: Record<string, string> = {
    inbox: 'Inbox',
    starred: 'Starred',
    sent: 'Sent mail',
    drafts: 'Drafts',
    trash: 'Trash',
    spam: 'Spam',
    settings: 'Settings',
    help: 'Help & feedback',
  }

  const open = shallowRef(false)
  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-nav-screen">
    <QuToolbar variant="primary">
      <QuToolbar.Nav aria-label="Open navigation" @click="open = true" />

      <QuToolbar.Title>{{ titles[page] }}</QuToolbar.Title>
    </QuToolbar>

    <p class="quantum-docs-nav-text" role="status">Open the drawer and choose a destination; choosing one closes it.</p>

    <QuNavigationDrawer v-model="open" aria-label="Mail">
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Item value="inbox">
            <QuList.Icon name="inbox" />

            Inbox
          </QuList.Item>

          <QuList.Item value="starred">
            <QuList.Icon name="star" />

            Starred
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
          <QuList.Item value="trash">
            <QuList.Icon name="delete" />

            Trash
          </QuList.Item>

          <QuList.Item value="spam">
            <QuList.Icon name="warning" />

            Spam
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
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .quantum-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-nav-text {
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
