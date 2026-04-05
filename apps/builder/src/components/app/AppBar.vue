<script setup lang="ts">
  import { mdiChevronRight, mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

  // Framework
  import { useTheme } from '@vuetify/v0'

  // Utilities
  import { computed, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  import { useBuilderStore } from '@/stores/builder'

  const theme = useTheme()
  const store = useBuilderStore()
  const route = useRoute()

  const logo = toRef(() =>
    theme.isDark.value
      ? 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-dark.svg'
      : 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-light.svg',
  )

  const icon = toRef(() => theme.isDark.value ? mdiWeatherSunny : mdiWeatherNight)

  const INTENT_LABELS: Record<string, string> = {
    'spa': 'SPA',
    'component-library': 'Component Library',
    'design-system': 'Design System',
    'admin-dashboard': 'Admin Dashboard',
    'content-site': 'Content Site',
    'mobile-first': 'Mobile-First',
  }

  const breadcrumbs = computed(() => {
    const path = route.path
    const crumbs: string[] = ['Builder']

    switch (path) {
      case '/guided': {
        crumbs.push('Guided')

        const intentId = store.intent.selectedId as string | undefined
        if (intentId) {
          crumbs.push(INTENT_LABELS[intentId] ?? intentId)
        }

        const qi = store.questionIndex
        const qc = store.questionCount
        if (qi >= 0 && qi < qc) {
          crumbs.push(`Question ${qi + 1}/${qc}`)
        } else if (qi >= qc && qc > 0) {
          crumbs.push('Review')
        }

        break
      }
      case '/free': {
        crumbs.push('Free Pick')

        break
      }
      case '/ai': {
        crumbs.push('AI Builder')

        break
      }
      case '/review': {
        crumbs.push('Review')

        break
      }
    // No default
    }

    return crumbs
  })

  function onToggle () {
    theme.select(theme.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 h-12 bg-surface/80 backdrop-blur-lg border-b border-divider flex items-center justify-between px-6">
    <img
      :alt="theme.isDark.value ? 'v0 dark logo' : 'v0 light logo'"
      class="w-24"
      :src="logo"
    >

    <nav class="flex items-center gap-1 text-sm">
      <template v-for="(crumb, index) in breadcrumbs" :key="index">
        <svg v-if="index > 0" class="w-4 h-4 text-on-surface-variant/40" viewBox="0 0 24 24">
          <path :d="mdiChevronRight" fill="currentColor" />
        </svg>
        <span
          :class="index === breadcrumbs.length - 1
            ? 'font-semibold text-on-surface'
            : 'text-on-surface-variant'"
        >
          {{ crumb }}
        </span>
      </template>
    </nav>

    <div class="flex items-center gap-3">
      <span
        v-if="store.selectedCount > 0"
        class="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
      >
        {{ store.selectedCount }} features
      </span>

      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-variant transition-colors"
        @click="onToggle"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24">
          <path :d="icon" fill="currentColor" />
        </svg>
      </button>
    </div>
  </header>
</template>
