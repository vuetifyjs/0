<script setup lang="ts">
  import { mdiBell } from '@mdi/js'

  // Framework
  import { Button, createQueue } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/notifications/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { ref, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { NotificationsConfig } from '@/plugins/notifications/defaults'
  import type { ID } from '@vuetify/v0'

  const MESSAGES = [
    'Report exported',
    'Invite sent to dana@acme.io',
    'Draft saved',
    'Deployment finished',
  ]

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useNotifications') return store.draft.config as NotificationsConfig

    return (store.pluginConfig.useNotifications as NotificationsConfig | undefined) ?? defaultConfig
  })

  const queue = createQueue({ reactive: true })

  const sent = shallowRef(0)

  const toasts = toRef(() => queue.values())

  // Toasts count down with a shrinking bar: the width flips from full to empty one frame
  // after the ticket starts, so the CSS transition has a previous value to animate from.
  const running = ref(new Set<ID>())

  watch(toasts, list => {
    const ids = new Set(list.map(toast => toast.id))
    const next = new Set([...running.value].filter(id => ids.has(id)))

    if (next.size !== running.value.size) running.value = next

    for (const toast of list) {
      if (toast.isPaused || running.value.has(toast.id)) continue

      const { id } = toast

      requestAnimationFrame(() => {
        running.value = new Set([...running.value, id])
      })
    }
  })

  function onSend () {
    queue.register({ value: MESSAGES[sent.value % MESSAGES.length], timeout: config.value.timeout })
    sent.value += 1
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">{{ config.timeout }}ms</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant font-mono truncate">
        {{ config.namespace }}
      </span>

      <span v-if="config.adapter !== 'none'" class="ml-auto text-[10px] text-on-surface-variant truncate">
        {{ config.adapter }}
      </span>
    </div>

    <MiniFrame title="notifications">
      <div class="space-y-3">
        <Button.Root
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-medium hover:opacity-90 transition-opacity"
          @click="onSend"
        >
          <Button.Icon>
            <Icon :path="mdiBell" :size="14" />
          </Button.Icon>

          <Button.Content>Send notification</Button.Content>
        </Button.Root>

        <div class="min-h-32 space-y-2">
          <div
            v-for="toast in toasts"
            :key="toast.id"
            class="rounded-lg border border-divider bg-surface-variant/50 px-3 py-2 space-y-1.5"
          >
            <div class="flex items-center gap-2">
              <span class="flex-1 text-xs text-on-surface truncate">{{ toast.value }}</span>

              <span v-if="toast.isPaused" class="text-[9px] uppercase tracking-wide text-on-surface-variant">queued</span>

              <Button.Root
                aria-label="Dismiss notification"
                class="text-[10px] text-on-surface-variant hover:text-on-surface"
                @click="toast.dismiss()"
              >
                <Button.Content>Dismiss</Button.Content>
              </Button.Root>
            </div>

            <span class="block h-0.5 rounded-full bg-surface-variant">
              <span
                class="block h-full rounded-full bg-primary"
                :style="{
                  width: running.has(toast.id) ? '0%' : '100%',
                  transition: toast.isPaused ? 'none' : `width ${config.timeout}ms linear`,
                }"
              />
            </span>
          </div>

          <p v-if="toasts.length === 0" class="text-[11px] italic text-on-surface-variant">
            Toasts auto-dismiss after {{ config.timeout }}ms; the newest waits its turn.
          </p>
        </div>
      </div>
    </MiniFrame>
  </div>
</template>
