<script setup lang="ts">
  import { createRegistry, useProxyRegistry } from '@vuetify/v0'
  import type { RegistryTicketInput } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  interface NotificationInput extends RegistryTicketInput<string> {
    type: 'info' | 'success' | 'warning' | 'error'
    read: boolean
  }

  const registry = createRegistry<NotificationInput>({ events: true })
  const proxy = useProxyRegistry(registry)

  const nextId = shallowRef(1)

  registry.onboard([
    { id: 'n-1', value: 'Build succeeded', type: 'success', read: false },
    { id: 'n-2', value: 'Disk usage at 85%', type: 'warning', read: false },
    { id: 'n-3', value: 'New user signed up', type: 'info', read: true },
  ])
  nextId.value = 4

  function add () {
    const types: NotificationInput['type'][] = ['info', 'success', 'warning', 'error']
    const messages = [
      'Deployment complete',
      'Memory spike detected',
      'New PR opened',
      'Test suite failed',
      'Cache invalidated',
      'SSL cert renewed',
    ]
    const type = types[Math.floor(Math.random() * types.length)]
    const message = messages[Math.floor(Math.random() * messages.length)]

    registry.register({
      id: `n-${nextId.value}`,
      value: message,
      type,
      read: false,
    })
    nextId.value++
  }

  function dismiss (id: string | number) {
    registry.unregister(id)
  }

  function read (id: string | number) {
    registry.upsert(id, { read: true })
  }

  const unread = toRef(() => proxy.values.filter(n => !n.read).length)

  const typeStyles: Record<string, { icon: string, color: string }> = {
    info: { icon: 'i-mdi-information', color: 'text-info' },
    success: { icon: 'i-mdi-check-circle', color: 'text-success' },
    warning: { icon: 'i-mdi-alert', color: 'text-warning' },
    error: { icon: 'i-mdi-alert-circle', color: 'text-error' },
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="text-sm font-medium text-on-surface">Notifications</span>

        <span
          v-if="unread > 0"
          class="px-1.5 py-0.5 text-xs font-medium rounded-full bg-error text-on-error"
        >
          {{ unread }}
        </span>
      </div>

      <button
        class="text-xs px-2 py-1 rounded border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
        @click="add"
      >
        + Add
      </button>
    </div>

    <!-- Reactive proxy state -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
        Proxy state
      </div>

      <div class="grid grid-cols-3 gap-1 text-xs">
        <span class="text-on-surface-variant/60">size</span>
        <span class="font-mono text-on-surface col-span-2">{{ proxy.size }}</span>

        <span class="text-on-surface-variant/60">keys</span>
        <span class="font-mono text-on-surface col-span-2 truncate">{{ proxy.keys.join(', ') || '—' }}</span>

        <span class="text-on-surface-variant/60">unread</span>
        <span class="font-mono text-on-surface col-span-2">{{ unread }}</span>
      </div>
    </div>

    <!-- Notification list -->
    <div class="space-y-1.5">
      <div
        v-for="notification in proxy.values"
        :key="notification.id"
        class="group flex items-start gap-3 px-3 py-2.5 rounded-lg border transition-all"
        :class="notification.read
          ? 'border-divider/50 bg-surface-variant/20'
          : 'border-divider bg-surface'"
      >
        <span
          class="mt-0.5 text-lg shrink-0"
          :class="[typeStyles[notification.type]?.icon, typeStyles[notification.type]?.color]"
        />

        <div class="flex-1 min-w-0">
          <p
            class="text-sm"
            :class="notification.read ? 'text-on-surface-variant' : 'text-on-surface font-medium'"
          >
            {{ notification.value }}
          </p>

          <p class="text-xs text-on-surface-variant/60 mt-0.5">
            {{ notification.type }} &middot; #{{ notification.index }}
          </p>
        </div>

        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            v-if="!notification.read"
            class="p-1 text-on-surface-variant hover:text-primary rounded transition-colors"
            title="Mark read"
            @click="read(notification.id)"
          >
            <span class="i-mdi-email-open-outline text-sm" />
          </button>

          <button
            class="p-1 text-on-surface-variant hover:text-error rounded transition-colors"
            title="Dismiss"
            @click="dismiss(notification.id)"
          >
            <span class="i-mdi-close text-sm" />
          </button>
        </div>
      </div>

      <p
        v-if="proxy.size === 0"
        class="text-center text-sm text-on-surface-variant py-6"
      >
        No notifications
      </p>
    </div>
  </div>
</template>
