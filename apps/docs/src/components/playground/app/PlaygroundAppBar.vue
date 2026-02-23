<script lang="ts" setup>
  import { IN_BROWSER } from '#v0/constants/globals'

  // Framework
  import { useTheme } from '@vuetify/v0'

  // Components
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed } from 'vue'
  import { RouterLink, useRouter } from 'vue-router'

  const router = useRouter()
  const theme = useTheme()
  const playground = usePlayground()

  const backTo = computed(() =>
    router.currentRoute.value.redirectedFrom?.fullPath
    ?? (IN_BROWSER ? window.history.state?.back : null)
    ?? '/',
  )
</script>

<template>
  <header class="flex items-center justify-between h-[48px] px-3 border-b border-divider bg-surface">
    <div class="flex items-center gap-3">
      <AppIconButton aria-label="Go back" :as="RouterLink" icon="left" :to="backTo" />

      <img
        alt="Vuetify Play"
        class="h-7"
        :src="theme.isDark
          ? 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-dark.svg'
          : 'https://vuetifyjs.b-cdn.net/docs/images/one/logos/vplay-logo-light.svg'"
      >
    </div>

    <div class="flex items-center gap-2">
      <button
        :aria-pressed="playground.selected('playground-left')"
        class="pa-1 inline-flex rounded hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none cursor-pointer transition-opacity"
        :class="playground.selected('playground-left') ? 'opacity-80' : 'opacity-50'"
        title="Toggle documentation panel"
        type="button"
        @click="playground.toggle('playground-left')"
      >
        <AppIcon icon="book" />
      </button>

      <AppThemeToggle />
    </div>
  </header>
</template>
