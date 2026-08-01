<script setup lang="ts">
  // Types
  import type { NotificationSeverity } from '@vuetify/v0'

  defineOptions({ name: 'OnyxToast' })

  const notifications = useNotifications()

  function fireToast (severity: NotificationSeverity) {
    notifications.send({
      subject: `${severity} toast`,
      body: `This is a ${severity} notification.`,
      severity,
    })
  }

  function fireActionToast () {
    notifications.send({
      subject: 'File deleted',
      severity: 'info',
      timeout: 8000,
      data: {
        action: {
          label: 'Undo',
          onClick: () => fireToast('success'),
        },
      },
    })
  }

  function fireFive () {
    for (let i = 1; i <= 5; i++) {
      notifications.send({ subject: `Toast ${i}`, body: 'Fired as part of a batch of 5.', severity: 'info' })
    }
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Toasts render bottom-right and auto-dismiss after 3 seconds by default — the queue has no
    concurrency cap, so firing several at once stacks all of them.
  </p>

  <h2 class="onyx-toast-page__heading mt-8">Severity</h2>

  <div class="flex flex-wrap items-center gap-2 mt-3">
    <OnButton size="sm" variant="outline" @click="fireToast('info')">Info</OnButton>
    <OnButton size="sm" variant="outline" @click="fireToast('success')">Success</OnButton>
    <OnButton size="sm" variant="outline" @click="fireToast('warning')">Warning</OnButton>
    <OnButton size="sm" variant="outline" @click="fireToast('error')">Error</OnButton>
  </div>

  <h2 class="onyx-toast-page__heading mt-8">With an action (undo)</h2>

  <div class="mt-3">
    <OnButton size="sm" variant="outline" @click="fireActionToast">Delete file</OnButton>
  </div>

  <h2 class="onyx-toast-page__heading mt-8">Queue — fire 5 rapidly</h2>

  <div class="mt-3">
    <OnButton size="sm" variant="outline" @click="fireFive">Fire 5 toasts</OnButton>
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-toast-page__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
