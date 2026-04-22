<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { Snackbar, useNotifications } from '@vuetify/v0'
  import type { NotificationSeverity } from '@vuetify/v0'

  const notifications = useNotifications()

  const severities: NotificationSeverity[] = ['info', 'success', 'warning', 'error']
  const index = shallowRef(0)

  const messages: Record<NotificationSeverity, string> = {
    info: 'Deployment started for production',
    success: 'Changes saved successfully',
    warning: 'API rate limit at 80%',
    error: 'Build failed — check logs',
  }

  const classes: Record<NotificationSeverity, string> = {
    info: 'bg-info text-on-info',
    success: 'bg-success text-on-success',
    warning: 'bg-warning text-on-warning',
    error: 'bg-error text-on-error',
  }

  function onShow () {
    const severity = severities[index.value % severities.length]
    index.value++
    notifications.send({ subject: messages[severity], severity, timeout: 4000 })
  }

  // Stacking behavior — consumer owns this
  const hovered = shallowRef(false)

  const ITEM_H = 44
  const GAP = 8
  const PEEK = 16
  const MAX_STACK = 3

  const containerHeight = computed(() => {
    const n = Math.min(notifications.queue.values().length, MAX_STACK)
    if (!n) return 0
    return hovered.value
      ? notifications.queue.values().length * ITEM_H + (notifications.queue.values().length - 1) * GAP
      : ITEM_H + (n - 1) * PEEK
  })

  function itemStyle (i: number) {
    if (hovered.value) {
      return {
        bottom: `${i * (ITEM_H + GAP)}px`,
        left: 0,
        right: 0,
        transform: 'none',
        opacity: 1,
        pointerEvents: 'auto' as const,
      }
    }

    if (i >= MAX_STACK) {
      const depth = MAX_STACK - 1
      return {
        bottom: 0,
        left: `${depth * 8}px`,
        right: `${depth * 8}px`,
        transform: `translateY(${-depth * PEEK}px) scale(${1 - depth * 0.04})`,
        transformOrigin: 'bottom center',
        opacity: 0,
        pointerEvents: 'none' as const,
        zIndex: -1,
      }
    }

    return {
      bottom: 0,
      left: `${i * 8}px`,
      right: `${i * 8}px`,
      transform: `translateY(${-i * PEEK}px) scale(${1 - i * 0.04})`,
      transformOrigin: 'bottom center',
      opacity: Math.max(0, 1 - i * 0.2),
      zIndex: MAX_STACK - i,
      pointerEvents: i === 0 ? 'auto' as const : 'none' as const,
    }
  }

  let leaveTimer: ReturnType<typeof setTimeout> | null = null

  function onEnter () {
    if (leaveTimer) {
      clearTimeout(leaveTimer)
      leaveTimer = null
    }
    hovered.value = true
  }

  function onLeave () {
    leaveTimer = setTimeout(() => {
      hovered.value = false
      leaveTimer = null
    }, 150)
  }
</script>

<template>
  <div class="flex flex-col items-center gap-6 min-h-48 p-6 bg-background rounded-lg border border-divider">
    <button
      class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium"
      @click="onShow"
    >
      Show Toast
    </button>

    <p class="text-sm opacity-40">
      Cycles through info → success → warning → error
    </p>
  </div>

  <Snackbar.Portal
    class="fixed bottom-4 right-4 w-72"
    :teleport="false"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
  >
    <Snackbar.Queue v-slot="{ items }">
      <div
        class="relative transition-all duration-300 ease-out"
        :style="{ height: `${containerHeight}px` }"
      >
        <div
          v-for="(item, i) in items"
          :key="item.id"
          class="absolute left-0 right-0 transition-all duration-300 ease-out"
          :style="itemStyle(i)"
        >
          <Snackbar.Root
            :id="item.id"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm"
            :class="classes[item.severity ?? 'info']"
          >
            <Snackbar.Content class="flex-1">
              {{ item.subject }}
            </Snackbar.Content>
            <Snackbar.Close
              v-show="hovered || i === 0"
              class="p-1 -mr-1 opacity-70 hover:opacity-100 shrink-0"
            >
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor" />
              </svg>
            </Snackbar.Close>
          </Snackbar.Root>
        </div>
      </div>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
