<script setup lang="ts">
  import { Md1List, Md1NavigationDrawer, Md1Subheader, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const page = shallowRef('inbox')
</script>

<template>
  <div class="md1-docs-screen md1-docs-drawer-screen">
    <Md1NavigationDrawer id="mini-drawer" v-model="open" mini type="persistent">
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

        <Md1Subheader>Folders</Md1Subheader>

        <Md1List v-model="page">
          <Md1List.Item value="trash">
            <Md1List.Icon name="delete" />

            Trash
          </Md1List.Item>
        </Md1List>
      </Md1NavigationDrawer.Content>
    </Md1NavigationDrawer>

    <div class="md1-docs-drawer-column">
      <Md1Toolbar variant="primary">
        <Md1Toolbar.Nav aria-controls="mini-drawer" aria-label="Expand navigation" :open @click="open = !open" />

        <Md1Toolbar.Title>Mail</Md1Toolbar.Title>
      </Md1Toolbar>

      <p class="md1-docs-drawer-text" role="status">Current page: {{ page }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-drawer-screen {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  /* The content beside the drawer; on a frame too narrow for both it clips under the drawer's edge. */
  .md1-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .md1-docs-drawer-text {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
