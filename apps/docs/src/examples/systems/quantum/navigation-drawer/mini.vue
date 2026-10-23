<script setup lang="ts">
  import { QuList, QuNavigationDrawer, QuSubheader, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
    <QuNavigationDrawer id="mini-drawer" v-model="open" mini type="persistent">
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

        <QuSubheader>Folders</QuSubheader>

        <QuList v-model="page">
          <QuList.Item value="trash">
            <QuList.Icon name="delete" />

            Trash
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-drawer-column">
      <QuToolbar variant="primary">
        <QuToolbar.Nav aria-controls="mini-drawer" aria-label="Expand navigation" :open @click="open = !open" />

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
