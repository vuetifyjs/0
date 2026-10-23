<script setup lang="ts">
  import { QuButton, QuList, QuNavigationDrawer } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const page = shallowRef('inbox')
  const accounts = ['ada@example.com', 'ada@work.example.com']
  const account = shallowRef(0)

  function onSwitch () {
    account.value = (account.value + 1) % accounts.length
  }
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
    <QuNavigationDrawer type="permanent">
      <QuNavigationDrawer.Header
        avatar="https://cdn.vuetifyjs.com/images/john.jpg"
        :email="accounts[account]"
        image="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        name="Ada Lovelace"
      >
        <QuButton aria-label="Switch account" class="quantum-docs-drawer-switch" icon="arrow-drop-down" @click="onSwitch" />
      </QuNavigationDrawer.Header>

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
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>

    <div class="quantum-docs-drawer-column">
      <p class="quantum-docs-drawer-text" role="status">Signed in as {{ accounts[account] }}</p>
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

  /* The account row sits on the image or the primary fill: the switcher takes the white ink of the name. */
  .quantum-docs-drawer-switch.quantum-button {
    color: var(--quantum-on-primary, #FFFFFF);
  }
</style>
