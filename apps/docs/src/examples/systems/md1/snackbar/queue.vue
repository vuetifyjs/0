<script setup lang="ts">
  import { Md1Button, Md1Snackbar } from '@paper/md1'
  import { createNotificationsContext } from '@vuetify/v0'
  import { onScopeDispose } from 'vue'

  // The docs install no notifications plugin, so this example provides its
  // own queue to the snackbars below it. An app installs createNotificationsPlugin().
  const [, provide, notifications] = createNotificationsContext()

  provide()

  onScopeDispose(() => {
    notifications.dispose()
    notifications.queue.dispose()
  })

  let count = 0

  function onSend () {
    count++
    notifications.send({ subject: `Message ${count} sent` })
  }

  function onUndo () {
    count = Math.max(0, count - 1)
  }

  // One on load, so the bar is visible before the first press.
  onSend()
</script>

<template>
  <div class="md1-docs-screen md1-docs-snackbar-screen">
    <p class="md1-docs-snackbar-note">
      Send twice in a row: the first snackbar leaves before the second arrives.
    </p>

    <Md1Button variant="raised" @click="onSend">Send</Md1Button>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar.Queue v-slot="{ item }">
        <Md1Snackbar action="Undo" @action="onUndo">{{ item.subject }}</Md1Snackbar>
      </Md1Snackbar.Queue>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-docs-snackbar-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-snackbar-note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
