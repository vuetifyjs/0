<script setup lang="ts">
  import { QuList, QuProgressLinear, QuSnackbar, QuToolbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-offline-screen">
    <QuToolbar app-bar>
      <QuToolbar.Title>Inbox</QuToolbar.Title>
    </QuToolbar>

    <div class="quantum-docs-offline-content">
      <QuProgressLinear aria-label="Waiting for a connection" />

      <QuList :lines="2">
        <QuList.Item v-for="message in messages" :key="message.id">
          <QuList.Avatar>{{ message.from[0] }}</QuList.Avatar>

          <QuList.Content>
            <QuList.Primary>{{ message.from }}</QuList.Primary>

            <QuList.Secondary>{{ message.subject }}</QuList.Secondary>
          </QuList.Content>
        </QuList.Item>
      </QuList>
    </div>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar v-model="open">No connection. Showing saved mail.</QuSnackbar>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-offline-screen {
    background: var(--quantum-surface, #FFFFFF);
  }

  .quantum-docs-offline-content {
    box-sizing: border-box;
    height: 100%;
    padding-top: var(--quantum-increment, 56px);
    overflow-y: auto;
  }
</style>
