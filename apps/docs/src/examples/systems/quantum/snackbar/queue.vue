<script setup lang="ts">
  import { QuButton, QuSnackbar } from '@paper/quantum'
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
  <div class="quantum-docs-screen quantum-docs-snackbar-screen">
    <p class="quantum-docs-snackbar-note">
      Send twice in a row: the first snackbar leaves before the second arrives.
    </p>

    <QuButton variant="raised" @click="onSend">Send</QuButton>

    <QuSnackbar.Portal :teleport="false">
      <QuSnackbar.Queue v-slot="{ item }">
        <QuSnackbar action="Undo" @action="onUndo">{{ item.subject }}</QuSnackbar>
      </QuSnackbar.Queue>
    </QuSnackbar.Portal>
  </div>
</template>

<style>
  .quantum-docs-snackbar-screen {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  .quantum-docs-snackbar-note {
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-body-1-size, 14px);
    line-height: var(--quantum-type-body-1-leading, 20px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
