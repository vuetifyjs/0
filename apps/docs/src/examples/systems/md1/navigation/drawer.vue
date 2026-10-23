<script setup lang="ts">
  import { Md1Divider, Md1List, Md1NavigationDrawer, Md1Toolbar } from '@paper/md1'
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
  <div class="md1-docs-screen md1-docs-nav-screen">
    <Md1Toolbar variant="primary">
      <Md1Toolbar.Nav aria-label="Open navigation" @click="open = true" />

      <Md1Toolbar.Title>{{ titles[page] }}</Md1Toolbar.Title>
    </Md1Toolbar>

    <p class="md1-docs-nav-text" role="status">Open the drawer and choose a destination; choosing one closes it.</p>

    <Md1NavigationDrawer v-model="open" aria-label="Mail">
      <Md1NavigationDrawer.Content>
        <Md1List v-model="page">
          <Md1List.Item value="inbox">
            <Md1List.Icon name="inbox" />

            Inbox
          </Md1List.Item>

          <Md1List.Item value="starred">
            <Md1List.Icon name="star" />

            Starred
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
          <Md1List.Item value="trash">
            <Md1List.Icon name="delete" />

            Trash
          </Md1List.Item>

          <Md1List.Item value="spam">
            <Md1List.Icon name="warning" />

            Spam
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
  </div>
</template>

<style>
  /* A handset screen: the bar's fixed position resolves against this frame, not the page. */
  .md1-docs-nav-screen {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-nav-text {
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
