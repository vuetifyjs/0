<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Atom, useNotifications } from '@vuetify/v0'

  // Utilities
  import { onScopeDispose, shallowRef, toRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const notifications = useNotifications()

  // Snooze persistence is owned by the notifications plugin (persist: true in
  // plugins/index.ts). This view seeds the banner, renders it, and triggers
  // snooze/dismiss — banner.snooze() is persisted and restored by the plugin.
  const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

  if (!notifications.has('alpha-banner')) {
    notifications.register({
      id: 'alpha-banner',
      subject: 'Vuetify0 is now in beta!',
      severity: 'warning',
      data: { type: 'banner' },
    })
  }

  const banner = toRef(() => {
    return notifications.values().find(n => n.data?.type === 'banner')
  })

  const dismissed = shallowRef(false)
  const snoozed = toRef(() => {
    const until = banner.value?.snoozedUntil
    return !!until && until.getTime() > Date.now()
  })
  const visible = toRef(() => banner.value && !dismissed.value && !snoozed.value)

  function onDismiss () {
    dismissed.value = true
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
    class="flex items-center justify-center h-[24px] fixed inset-x-0 top-0 px-3 text-xs gap-2 text-on-primary z-1 bg-glass-primary"
  >
    <AppIcon icon="vuetify-0" :size="14" />

    <div>
      {{ banner?.subject }} <span class="hidden md:inline">See the <RouterLink class="underline underline-offset-2" to="/roadmap#beta">roadmap</RouterLink> for details.</span>
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
