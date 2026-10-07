<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Atom, useNotifications, useStorage } from '@vuetify/v0'

  // Utilities
  import { onScopeDispose, toRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const notifications = useNotifications()
  const storage = useStorage()

  // No active announcement. Bump BANNER_ID and register a ticket to re-show.
  const BANNER_ID = 'none'
  const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

  const banner = toRef(() => {
    return notifications.values().find(n => n.data?.type === 'banner')
  })

  const dismissedId = storage.get<string>('docs-banner-dismissed', '')
  const snoozed = toRef(() => {
    const until = banner.value?.snoozedUntil
    return !!until && until.getTime() > Date.now()
  })
  const visible = toRef(() => banner.value && dismissedId.value !== BANNER_ID && !snoozed.value)

  function onDismiss () {
    storage.set('docs-banner-dismissed', BANNER_ID)
  }

  function onSnooze () {
    banner.value?.snooze(new Date(Date.now() + SNOOZE_MS))
  }

  watchEffect(() => {
    if (!IN_BROWSER) return
    document.documentElement.style.setProperty('--app-banner-h', visible.value ? '24px' : '0px')
  })

  onScopeDispose(() => {
    if (!IN_BROWSER) return
    document.documentElement.style.removeProperty('--app-banner-h')
  })
</script>

<template>
  <Atom
    v-if="visible"
    :as
    class="flex items-center justify-center h-[24px] fixed inset-x-0 top-0 px-3 text-xs gap-2 text-on-primary z-1 bg-primary"
  >
    <AppIcon class="shrink-0" icon="vuetify-0" :size="14" />

    <div class="min-w-0 truncate pe-6">
      {{ banner?.subject }}
    </div>

    <div class="absolute end-2 flex items-center gap-2">
      <button
        aria-label="Snooze banner for a week"
        class="opacity-60 hover:opacity-100 transition-opacity"
        @click="onSnooze"
      >
        <AppIcon icon="clock" :size="11" />
      </button>

      <button
        aria-label="Dismiss banner"
        class="opacity-60 hover:opacity-100 transition-opacity"
        @click="onDismiss"
      >
        <AppIcon icon="close" :size="10" />
      </button>
    </div>
  </Atom>
</template>
