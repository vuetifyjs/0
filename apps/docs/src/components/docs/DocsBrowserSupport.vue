<script setup lang="ts">
  // Components
  import AppBrowserIcon from '@/components/app/AppBrowserIcon.vue'
  import AppIcon from '@/components/app/AppIcon.vue'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { BrowserName } from '@/components/app/AppBrowserIcon.vue'

  export interface BrowserVersion {
    chrome?: string
    firefox?: string
    safari?: string
    edge?: string
    opera?: string
  }

  export interface DocsBrowserSupportProps {
    /** Feature name for display */
    feature: string
    /** Minimum browser versions required */
    versions: BrowserVersion
    /** Optional link to browser support page section */
    anchor?: string
  }

  const props = withDefaults(defineProps<DocsBrowserSupportProps>(), {
    anchor: undefined,
  })

  const browsers = computed(() => {
    const list: { browser: BrowserName, name: string, version: string }[] = []

    if (props.versions.chrome) {
      list.push({ browser: 'chrome', name: 'Chrome', version: props.versions.chrome })
    }
    if (props.versions.edge) {
      list.push({ browser: 'edge', name: 'Edge', version: props.versions.edge })
    }
    if (props.versions.firefox) {
      list.push({ browser: 'firefox', name: 'Firefox', version: props.versions.firefox })
    }
    if (props.versions.safari) {
      list.push({ browser: 'safari', name: 'Safari', version: props.versions.safari })
    }
    if (props.versions.opera) {
      list.push({ browser: 'opera', name: 'Opera', version: props.versions.opera })
    }

    return list
  })

  const hasLimitedSupport = computed(() => {
    return !props.versions.safari || props.versions.safari === '—'
  })
</script>

<template>
  <div
    class="my-4 rounded-lg border px-4 py-3"
    :class="hasLimitedSupport ? 'bg-warning/10 border-warning/30' : 'bg-info/10 border-info/30'"
  >
    <div class="flex items-center gap-2 font-semibold mb-2" :class="hasLimitedSupport ? 'text-warning' : 'text-info'">
      <AppIcon icon="alert" :size="18" />

      <span>Browser Support: {{ feature }}</span>
    </div>

    <div class="flex flex-wrap gap-x-4 gap-y-1 text-on-surface text-sm">
      <span v-for="b in browsers" :key="b.browser" class="inline-flex items-center gap-1">
        <AppBrowserIcon :browser="b.browser" :size="16" />
        {{ b.name }} {{ b.version }}
      </span>

      <span v-if="!versions.safari" class="inline-flex items-center gap-1 text-on-surface/60">
        <AppBrowserIcon browser="safari" class="opacity-50" :size="16" />
        Safari —
      </span>
    </div>

    <div class="mt-2 text-sm text-on-surface/80">
      <slot>
        This feature requires modern browser support.
        <RouterLink
          v-if="anchor"
          class="text-primary hover:underline"
          :to="`/introduction/browser-support#${anchor}`"
        >
          Learn more
        </RouterLink>
      </slot>
    </div>
  </div>
</template>
