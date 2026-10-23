<script setup lang="ts">
  import { Md1Button, Md1List, Md1NavigationDrawer } from '@paper/md1'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
  const accounts = ['ada@example.com', 'ada@work.example.com']
  const account = shallowRef(0)

  function onSwitch () {
    account.value = (account.value + 1) % accounts.length
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-drawer-screen">
    <Md1NavigationDrawer type="permanent">
      <Md1NavigationDrawer.Header
        avatar="https://cdn.vuetifyjs.com/images/john.jpg"
        :email="accounts[account]"
        image="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        name="Ada Lovelace"
      >
        <Md1Button aria-label="Switch account" class="md1-docs-drawer-switch" icon="arrow-drop-down" @click="onSwitch" />
      </Md1NavigationDrawer.Header>

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

    <div class="md1-docs-drawer-column">
      <p class="md1-docs-drawer-text" role="status">Signed in as {{ accounts[account] }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-drawer-screen {
    display: flex;
    background: var(--md1-background, #FAFAFA);
    container-type: inline-size;
  }

  /*
   * The frame stands in for the device screen, so a drawer laid out in it
   * takes the drawer width rule (the screen less one increment, at most five
   * increments) from the frame, not the viewport, and never spills past its
   * edge. A temporary drawer opens over the whole page, so it keeps the rule
   * against the viewport.
   */
  .md1-docs-drawer-screen .md1-navigation-drawer:not([data-type='temporary']),
  .md1-docs-drawer-screen .md1-navigation-drawer:not([data-type='temporary']) .md1-navigation-drawer__sheet {
    width: min(calc(100cqw - var(--md1-increment, 56px)), calc(5 * var(--md1-increment, 56px)));
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

  /* The account row sits on the image or the primary fill: the switcher takes the white ink of the name. */
  .md1-docs-drawer-switch.md1-button {
    color: var(--md1-on-primary, #FFFFFF);
  }
</style>
