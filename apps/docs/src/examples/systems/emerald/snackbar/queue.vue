<script setup lang="ts">
  import {
    EmButton,
    EmSnackbar,
    EmSnackbarClose,
    EmSnackbarContent,
    EmSnackbarPortal,
    EmSnackbarQueue,
  } from '@paper/emerald'

  import { createNotificationsContext } from '@vuetify/v0'
  import { onScopeDispose } from 'vue'

  import type { EmSnackbarVariant } from '@paper/emerald'
  import type { NotificationSeverity } from '@vuetify/v0'

  // The sandbox installs no notifications plugin, so this example provides
  // its own queue to the components below it.
  const [, provide, notifications] = createNotificationsContext({ timeout: 5000 })

  provide()

  onScopeDispose(() => {
    notifications.dispose()
    notifications.queue.dispose()
  })

  const tones: Record<string, EmSnackbarVariant> = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  }

  function tone (severity?: string): EmSnackbarVariant {
    return tones[severity ?? ''] ?? 'neutral'
  }

  const subjects: Record<string, string> = {
    success: 'Changes published.',
    error: 'Upload failed — try again.',
    info: 'Deployment started for production.',
  }

  function onSend (severity: NotificationSeverity) {
    notifications.send({ subject: subjects[severity], severity })
  }
</script>

<template>
  <div class="emerald-docs-queue-demo">
    <div class="emerald-docs-queue-actions">
      <EmButton @click="onSend('success')">Publish</EmButton>

      <EmButton variant="secondary" @click="onSend('info')">Deploy</EmButton>

      <EmButton variant="tertiary" @click="onSend('error')">Fail an upload</EmButton>
    </div>

    <EmSnackbarPortal :teleport="false">
      <EmSnackbarQueue v-slot="{ items }">
        <EmSnackbar
          v-for="item in items"
          :id="item.id"
          :key="item.id"
          :variant="tone(item.severity)"
        >
          <EmSnackbarContent>{{ item.subject }}</EmSnackbarContent>

          <EmSnackbarClose />
        </EmSnackbar>
      </EmSnackbarQueue>
    </EmSnackbarPortal>
  </div>
</template>

<style>
  .emerald-docs-queue-demo {
    position: relative;
    display: flex;
    align-items: flex-start;
    width: 100%;
    min-height: 220px;
  }

  .emerald-docs-queue-demo .emerald-snackbar-portal {
    position: absolute;
  }

  .emerald-docs-queue-actions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-xs, 8px);
  }
</style>
