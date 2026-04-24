<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { mdiClose, mdiArchiveOutline, mdiClockOutline, mdiBellOutline } from '@mdi/js'
  import { Snackbar, useProxyRegistry } from '@vuetify/v0'
  import { createAppNotifications, provideNotifications } from './context'
  import type { NotificationTicket } from '@vuetify/v0'

  const notifications = createAppNotifications()
  provideNotifications(notifications)

  const proxy = useProxyRegistry(notifications)
  const queueProxy = useProxyRegistry(notifications.queue)

  // Only show the most recent banner
  const banner = computed(() =>
    proxy.values.find(t => t.data?.type === 'banner'),
  )

  // Toasts — driven by the queue (auto-dismiss handled by timeout)
  const toasts = computed(() =>
    queueProxy.values
      .map(q => notifications.get(q.id))
      .filter(n => n?.data?.type === 'toast'),
  )

  const inlines = computed(() =>
    proxy.values.filter(t => t.data?.type === 'inline'),
  )

  const inbox = computed(() =>
    proxy.values.filter(t => (!t.data?.type || t.data?.type === 'inbox') && !t.archivedAt),
  )

  const unread = computed(() =>
    inbox.value.filter(t => !t.readAt),
  )

  const archived = computed(() =>
    proxy.values.filter(t => (!t.data?.type || t.data?.type === 'inbox') && !!t.archivedAt),
  )

  const open = shallowRef(false)
  const tab = shallowRef<'unread' | 'all' | 'archived'>('unread')

  function onToggle () {
    open.value = !open.value
    if (open.value) {
      for (const ticket of inbox.value) {
        if (!ticket.seenAt) notifications.seen(ticket.id)
      }
    }
  }

  function onSnooze (ticket: NotificationTicket) {
    const until = new Date(Date.now() + 30_000) // 30s for demo
    ticket.snooze(until)
  }

  function elapsed (date: Date): string {
    const s = Math.floor((Date.now() - date.getTime()) / 1000)
    if (s < 60) return 'just now'
    const m = Math.floor(s / 60)
    return `${m}m ago`
  }

  const severity: Record<string, string> = {
    success: 'bg-success text-on-success',
    error: 'bg-error text-on-error',
    warning: 'bg-warning text-on-warning',
    info: 'bg-info text-on-info',
  }
</script>

<template>
  <div class="relative flex flex-col min-h-64 border border-divider rounded-lg overflow-hidden bg-background">
    <!-- App header -->
    <div class="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-divider">
      <span class="text-sm font-medium opacity-60">My App</span>

      <div class="flex-1" />

      <slot />

      <!-- Inbox bell -->
      <div class="relative">
        <button
          class="px-3 py-1.5 bg-surface border border-divider rounded text-sm flex items-center gap-1.5"
          @click="onToggle"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiBellOutline" fill="currentColor" /></svg>
          Inbox

          <span
            v-if="unread.length > 0"
            class="absolute -top-1.5 -right-1.5 bg-error text-on-error text-xs rounded-full min-w-5 h-5 flex items-center justify-center px-1"
          >
            {{ unread.length }}
          </span>
        </button>
      </div>
    </div>

    <!-- Banner (max 1) -->
    <div
      v-if="banner"
      class="flex items-center gap-3 px-4 py-2 text-sm"
      :class="severity[banner.severity ?? 'info']"
    >
      <span class="flex-1">{{ banner.subject }}</span>

      <button class="p-1 -mr-1 opacity-70 hover:opacity-100" @click.stop="notifications.unregister(banner.id)">
        <svg class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
      </button>
    </div>

    <!-- Content area -->
    <div class="flex-1 px-4 py-6">
      <p class="text-sm opacity-40 text-center">Click Simulate Event to push notifications</p>

      <!-- Inline notifications — contextual, embedded in content -->
      <div
        v-for="ticket in inlines"
        :key="ticket.id"
        class="flex items-center gap-3 mt-4 px-3 py-2 rounded border text-sm"
        :class="{
          'border-warning/30 bg-warning/10 text-warning': ticket.severity === 'warning',
          'border-error/30 bg-error/10 text-error': ticket.severity === 'error',
          'border-info/30 bg-info/10 text-info': ticket.severity === 'info',
          'border-success/30 bg-success/10 text-success': ticket.severity === 'success',
        }"
      >
        <span class="flex-1">{{ ticket.subject }}</span>

        <button class="p-1 -mr-1 opacity-50 hover:opacity-100" @click.stop="notifications.unregister(ticket.id)">
          <svg class="w-3.5 h-3.5 pointer-events-none" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
        </button>
      </div>
    </div>

    <!-- Inbox panel -->
    <div v-if="open" class="border border-divider rounded-lg overflow-hidden bg-surface">
      <div class="flex border-b border-divider text-sm">
        <button
          v-for="t in (['unread', 'all', 'archived'] as const)"
          :key="t"
          class="flex-1 px-4 py-2 capitalize"
          :class="tab === t ? 'bg-surface-variant font-medium' : 'opacity-60'"
          @click="tab = t"
        >
          {{ t }}
          <span v-if="t === 'unread' && unread.length > 0" class="ml-1 opacity-60">({{ unread.length }})</span>
          <span v-if="t === 'archived' && archived.length > 0" class="ml-1 opacity-60">({{ archived.length }})</span>
        </button>
      </div>

      <div class="max-h-64 overflow-y-auto">
        <div
          v-for="ticket in (tab === 'unread' ? unread : tab === 'archived' ? archived : inbox)"
          :key="ticket.id"
          class="flex items-start gap-3 px-4 py-3 border-b border-divider last:border-b-0"
        >
          <span
            v-if="!ticket.readAt"
            class="mt-2 w-2 h-2 rounded-full bg-primary shrink-0"
          />

          <span v-else class="mt-2 w-2 h-2 shrink-0" />

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-sm truncate" :class="{ 'font-bold': !ticket.readAt }">
                {{ ticket.subject }}
              </span>

              <span class="text-xs opacity-40 shrink-0">{{ elapsed(ticket.createdAt) }}</span>
            </div>

            <p v-if="ticket.body" class="text-xs opacity-60 mt-0.5 truncate">{{ ticket.body }}</p>

            <div class="flex gap-2 mt-1.5">
              <button class="text-xs text-primary" @click="ticket.readAt ? ticket.unread() : ticket.read()">
                {{ ticket.readAt ? 'Mark unread' : 'Mark read' }}
              </button>

              <button class="text-xs opacity-40 flex items-center gap-0.5" @click="ticket.archivedAt ? ticket.unarchive() : ticket.archive()">
                <svg class="w-3 h-3" viewBox="0 0 24 24"><path :d="mdiArchiveOutline" fill="currentColor" /></svg>
                {{ ticket.archivedAt ? 'Unarchive' : 'Archive' }}
              </button>

              <button
                v-if="!ticket.snoozedUntil"
                class="text-xs opacity-40 flex items-center gap-0.5"
                @click="onSnooze(ticket)"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24"><path :d="mdiClockOutline" fill="currentColor" /></svg>
                Snooze
              </button>

              <span v-else class="text-xs opacity-40">Snoozed</span>
            </div>
          </div>
        </div>

        <div v-if="(tab === 'unread' ? unread : tab === 'archived' ? archived : inbox).length === 0" class="px-4 py-8 text-center text-sm opacity-40">
          No notifications
        </div>
      </div>

      <div v-if="inbox.length > 0" class="flex justify-between px-4 py-2 border-t border-divider text-xs">
        <button class="text-primary" @click="notifications.readAll()">Mark all read</button>
        <button class="opacity-40" @click="notifications.archiveAll()">Archive all</button>
      </div>
    </div>

    <!-- Toasts — rendered from notifications.queue via Snackbar -->
    <Snackbar.Portal class="fixed bottom-4 right-4 flex flex-col gap-2" :teleport="false">
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in absolute w-full"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        move-class="transition duration-200"
      >
        <Snackbar.Root
          v-for="ticket in toasts"
          :key="ticket!.id"
          class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm min-w-64"
          :class="severity[ticket!.severity ?? 'info']"
        >
          <Snackbar.Content class="flex-1">
            {{ ticket!.subject }}
          </Snackbar.Content>

          <Snackbar.Close
            class="p-1 -mr-1 opacity-70 hover:opacity-100"
            @click="ticket!.dismiss()"
          >
            <svg aria-hidden="true" class="w-4 h-4 pointer-events-none" viewBox="0 0 24 24">
              <path :d="mdiClose" fill="currentColor" />
            </svg>
          </Snackbar.Close>
        </Snackbar.Root>
      </TransitionGroup>
    </Snackbar.Portal>
  </div>
</template>
