<script setup lang="ts">
  import { useNotifications } from './context'
  import type { AppNotificationInput } from './context'

  const notifications = useNotifications()

  const scenarios: AppNotificationInput[] = [
    // Banner — persistent, system-wide, max 1 visible
    {
      subject: 'Your trial expires in 3 days',
      severity: 'warning',
      timeout: -1,
      data: { type: 'banner' },
    },
    // Toast — auto-dismiss after 4s
    {
      subject: 'Changes saved',
      severity: 'success',
      timeout: 4000,
      data: { type: 'toast' },
    },
    // Inbox — persistent, full lifecycle
    {
      subject: 'Build failed on main',
      body: 'CI pipeline failed — 3 tests broken in auth module',
      severity: 'error',
      timeout: -1,
      data: { type: 'inbox' },
    },
    // Inbox — snoozeable
    {
      subject: 'Review your security settings',
      body: 'Two-factor authentication is not enabled',
      severity: 'info',
      timeout: -1,
      data: { type: 'inbox' },
    },
    // Toast — ephemeral confirmation
    {
      subject: 'Deployment complete',
      severity: 'success',
      timeout: 4000,
      data: { type: 'toast' },
    },
    // Inline — contextual, embedded in page
    {
      subject: 'API rate limit approaching — 80% of quota consumed',
      severity: 'warning',
      timeout: -1,
      data: { type: 'inline' },
    },
    // Inbox — collaboration
    {
      subject: 'PR #142 review requested',
      body: 'Alex requested your review on feat/notifications',
      severity: 'info',
      timeout: -1,
      data: { type: 'inbox' },
    },
  ]

  let index = 0

  function simulate () {
    notifications.send(scenarios[index % scenarios.length]!)
    index++
  }
</script>

<template>
  <button
    class="px-3 py-1.5 bg-primary text-on-primary rounded text-sm font-medium"
    @click="simulate"
  >
    Simulate Event
  </button>
</template>
