<script setup lang="ts">
  import { Md1Divider, Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef } from 'vue'

  const labels = ['Short title', 'A little longer title', 'A very long title that will truncate at the drawer edge', 'A shorter title', 'Travel', 'Receipts', 'Family', 'Projects', 'Newsletters']

  const page = shallowRef('inbox')
</script>

<template>
  <div class="md1-docs-screen md1-docs-nav-scroll">
    <Md1NavigationDrawer aria-label="Mail" type="permanent">
      <Md1NavigationDrawer.Header email="ada@example.com" name="Ada Lovelace" />

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
        </Md1List>

        <Md1Divider />

        <Md1List v-model="page">
          <Md1List.Item v-for="label in labels" :key="label" :value="label">
            <Md1List.Icon name="label" />

            {{ label }}
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

    <p class="md1-docs-nav-text" role="status">Scroll the drawer.</p>
  </div>
</template>

<style>
  /* A short handset frame, so the drawer's destinations outgrow it and the sheet scrolls. */
  .md1-docs-screen.md1-docs-nav-scroll {
    display: flex;
    height: 400px;
    background: var(--md1-background, #FAFAFA);
  }
</style>
