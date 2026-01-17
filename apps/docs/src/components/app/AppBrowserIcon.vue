<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Utilities
  import { computed } from 'vue'

  const browsers = {
    chrome: { icon: 'chrome', color: 'text-[#34A853]', title: 'Chrome' },
    firefox: { icon: 'firefox', color: 'text-[#FF7139]', title: 'Firefox' },
    safari: { icon: 'safari', color: 'text-[#006CFF]', title: 'Safari' },
    edge: { icon: 'edge', color: 'text-[#0078D4]', title: 'Edge' },
    opera: { icon: 'opera', color: 'text-[#FF1B2D]', title: 'Opera' },
  } as const

  export type BrowserName = keyof typeof browsers

  export interface AppBrowserIconProps {
    browser: BrowserName
    size?: number
  }

  const props = withDefaults(defineProps<AppBrowserIconProps>(), {
    size: 18,
  })

  const config = computed(() => browsers[props.browser])
</script>

<template>
  <AppIcon
    class="align-sub"
    :class="config.color"
    :icon="config.icon"
    :size="size"
    :title="config.title"
  />
</template>
