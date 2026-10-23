<script setup lang="ts">
  import { QuDivider, QuList, QuNavigationDrawer, QuSubheader, QuToolbar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const page = shallowRef('inbox')
</script>

<template>
  <div class="quantum-docs-screen quantum-docs-drawer-screen">
    <div class="quantum-docs-drawer-column">
      <QuToolbar variant="primary">
        <QuToolbar.Nav aria-label="Open navigation" @click="open = true" />

        <QuToolbar.Title>Mail</QuToolbar.Title>
      </QuToolbar>

      <p class="quantum-docs-drawer-text" role="status">Current page: {{ page }}</p>
    </div>

    <QuNavigationDrawer v-model="open">
      <QuNavigationDrawer.Content>
        <QuList v-model="page">
          <QuList.Item value="inbox">
            <QuList.Icon name="inbox" />

            Inbox
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

        <QuSubheader>Labels</QuSubheader>

        <QuList v-model="page">
          <QuList.Item value="family">
            <QuList.Icon name="label" />

            Family
          </QuList.Item>

          <QuList.Item value="work">
            <QuList.Icon name="label" />

            Work
          </QuList.Item>
        </QuList>
      </QuNavigationDrawer.Content>
    </QuNavigationDrawer>
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
