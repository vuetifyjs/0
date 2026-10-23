<script setup lang="ts">
  import { Md1Button, Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
</script>

<template>
  <div class="md1-docs-screen md1-docs-drawer-screen">
    <div class="md1-docs-drawer-column">
      <div class="md1-docs-drawer-bar">
        <Md1NavigationDrawer>
          <Md1NavigationDrawer.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" variant="raised">Open navigation</Md1Button>
          </Md1NavigationDrawer.Activator>

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

              <Md1List.Item value="sent">
                <Md1List.Icon name="send" />

                Sent mail
              </Md1List.Item>

              <Md1List.Item value="drafts">
                <Md1List.Icon name="drafts" />

                Drafts
              </Md1List.Item>
            </Md1List>
          </Md1NavigationDrawer.Content>
        </Md1NavigationDrawer>
      </div>

      <p class="md1-docs-drawer-text" role="status">Current page: {{ page }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-drawer-screen {
    display: flex;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-drawer-column {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  .md1-docs-drawer-bar {
    display: flex;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) 0;
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
