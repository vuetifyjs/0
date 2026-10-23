<script setup lang="ts">
  import { Md1List, Md1ProgressLinear, Md1Snackbar, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  // Shown on load so the bar is visible; it still leaves after the 6000 ms default.
  const open = shallowRef(true)

  const messages = [
    { id: 1, from: 'Ali Connors', subject: 'Brunch this weekend?' },
    { id: 2, from: 'Trevor Hansen', subject: 'Summer barbecue' },
    { id: 3, from: 'Sandra Adams', subject: 'Oui oui' },
  ]
</script>

<template>
  <div class="md1-docs-screen md1-docs-offline-screen">
    <Md1Toolbar app-bar>
      <Md1Toolbar.Title>Inbox</Md1Toolbar.Title>
    </Md1Toolbar>

    <div class="md1-docs-offline-content">
      <Md1ProgressLinear aria-label="Waiting for a connection" />

      <Md1List :lines="2">
        <Md1List.Item v-for="message in messages" :key="message.id">
          <Md1List.Avatar>{{ message.from[0] }}</Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>{{ message.from }}</Md1List.Primary>

            <Md1List.Secondary>{{ message.subject }}</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="open">No connection. Showing saved mail.</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-offline-screen {
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-offline-content {
    box-sizing: border-box;
    height: 100%;
    padding-top: var(--md1-increment, 56px);
    overflow-y: auto;
  }
</style>
