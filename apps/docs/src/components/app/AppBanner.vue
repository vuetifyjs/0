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

  // Bump BANNER_ID whenever the banner content changes — a new id re-shows the
  // banner even for readers who dismissed the previous one.
  const BANNER_ID = 'v1.0-live'

  if (!notifications.has(BANNER_ID)) {
    notifications.register({
      id: BANNER_ID,
      subject: 'Vuetify0 v1.0 is here',
      severity: 'warning',
      data: { type: 'banner' },
    })
  }

  const banner = toRef(() => {
    return notifications.values().find(n => n.data?.type === 'banner')
  })

  // Persist dismissal keyed to the banner id, so a dismissed banner stays closed
  // across reloads until BANNER_ID changes.
  const dismissedId = storage.get<string>('docs-banner-dismissed', '')
  const visible = toRef(() => banner.value && dismissedId.value !== BANNER_ID)

  function onDismiss () {
    storage.set('docs-banner-dismissed', BANNER_ID)
  }

  // Sync banner height to CSS variable so AppBar, AppNav, and layouts can adapt
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
    class="flex items-center justify-center h-[24px] fixed inset-x-0 top-0 px-3 text-xs gap-2 text-on-primary z-1 bg-glass-primary"
  >
    <AppIcon class="shrink-0" icon="vuetify-0" :size="14" />

    <div class="min-w-0 truncate pe-6">
      {{ banner?.subject }}<span class="hidden sm:inline"> — the stable release is live!</span><span class="hidden md:inline"> Read the <RouterLink class="underline underline-offset-2" to="/releases">release notes</RouterLink>.</span>
    </div>

    <button
      aria-label="Dismiss banner"
      class="absolute end-2 opacity-60 hover:opacity-100 transition-opacity"
      @click="onDismiss"
    >
      <AppIcon icon="close" :size="10" />
    </button>
  </Atom>
</template>
