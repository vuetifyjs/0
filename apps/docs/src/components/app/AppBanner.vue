<script setup lang="ts">
  // Framework
  import { IN_BROWSER, Atom, useNotifications } from '@vuetify/v0'

  // Utilities
  import { onScopeDispose, shallowRef, toRef, watchEffect } from 'vue'

  // Types
  import type { AtomProps } from '@vuetify/v0'

  const { as = 'header' } = defineProps<AtomProps>()

  const notifications = useNotifications()

  // Seed banner notification (replaced by CMS adapter later)
  if (!notifications.has('pre-alpha-banner')) {
    notifications.register({
      id: 'pre-alpha-banner',
      subject: 'You are viewing Pre-Alpha documentation.',
      severity: 'warning',
      data: { type: 'banner' },
    })
  }

  const banner = toRef(() => {
    return notifications.values().find(n => n.data?.type === 'banner')
  })

  const dismissed = shallowRef(false)
  const visible = toRef(() => banner.value && !dismissed.value)

  function onDismiss () {
    dismissed.value = true
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
    class="flex items-center justify-center h-[24px] fixed inset-x-0 top-0 px-3 text-xs gap-2 text-on-warning z-1 bg-glass-warning"
  >
    <AppIcon icon="alert" :size="14" />

    <div>
      {{ banner?.subject }} <span class="hidden md:inline">See the <RouterLink class="underline underline-offset-2" to="/roadmap">roadmap</RouterLink> for updates.</span>
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
