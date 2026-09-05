<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Atom, useNotifications, useStorage } from '@vuetify/v0'

  // Constants
  import { INDEXABLE, PROD_SITE_URL } from '@/constants/site'

  // Utilities
  import { onScopeDispose, toRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const notifications = useNotifications()
  const storage = useStorage()

  // Bump BANNER_ID whenever the banner content changes — a new id re-shows the
  // banner even for readers who dismissed the previous one.
  const BANNER_ID = INDEXABLE ? 'v1.0-live' : 'docs-dev-unreleased'
  const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

  // Snooze is owned by the notifications plugin (persist: true). Dismiss is a
  // separate storage key so a content bump still re-shows the banner.
  if (!notifications.has(BANNER_ID)) {
    notifications.register({
      id: BANNER_ID,
      subject: INDEXABLE ? 'Vuetify0 v1.0 is here' : 'Unreleased dev docs',
      severity: 'warning',
      data: { type: 'banner' },
    })
  }

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
    class="flex items-center justify-center h-[24px] fixed inset-x-0 top-0 px-3 text-xs gap-2 text-on-primary z-1 bg-primary"
  >
    <AppIcon class="shrink-0" icon="vuetify-0" :size="14" />

    <div class="min-w-0 truncate pe-6">
      <template v-if="INDEXABLE">
        {{ banner?.subject }}<span class="hidden sm:inline"> — the stable release is live!</span><span class="hidden md:inline"> Read the <a class="underline underline-offset-2" href="https://vtfy.link/announcing-vuetify0-v1" rel="noopener" target="_blank">announcement</a>.</span>
      </template>

      <template v-else>
        {{ banner?.subject }}<span class="hidden sm:inline"> — queued features, not a release.</span><span class="hidden md:inline"> Stable docs: <a class="underline underline-offset-2" :href="PROD_SITE_URL" rel="noopener">0.vuetifyjs.com</a>.</span>
      </template>
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
