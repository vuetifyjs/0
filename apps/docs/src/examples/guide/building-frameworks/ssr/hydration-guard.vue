<script setup lang="ts">
  // Composables
  import { useHydration } from '@vuetify/v0'
  // Constants
  import { IN_BROWSER } from '@vuetify/v0/constants'
  // Utilities
  import { shallowRef, toRef, watchEffect } from 'vue'

  const { isHydrated } = useHydration()

  // Browser-only state
  const windowWidth = shallowRef(0)
  const userAgent = shallowRef('')

  // Safe to access window after hydration
  watchEffect(() => {
    if (!isHydrated.value) return

    windowWidth.value = window.innerWidth
    userAgent.value = navigator.userAgent.slice(0, 50) + '...'
  })

  // Static check example
  const staticBrowserCheck = IN_BROWSER ? 'Client' : 'Server'

  const hydrationStatus = toRef(() => isHydrated.value ? 'Hydrated' : 'SSR')
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-on-surface-variant">
      v0 provides two ways to handle SSR safely:
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <!-- Static check -->
      <div class="p-4 bg-surface border border-divider rounded-lg">
        <h3 class="text-sm font-semibold mb-3">IN_BROWSER constant</h3>
        <p class="text-xs text-on-surface-variant mb-3">
          Static check, evaluated once at import time.
        </p>
        <div class="p-2 bg-surface-variant rounded font-mono text-sm">
          {{ staticBrowserCheck }}
        </div>
        <pre class="mt-3 text-xs text-on-surface-variant">if (IN_BROWSER) {
  // Safe to use window, document
}</pre>
      </div>

      <!-- Reactive check -->
      <div class="p-4 bg-surface border border-divider rounded-lg">
        <h3 class="text-sm font-semibold mb-3">useHydration()</h3>
        <p class="text-xs text-on-surface-variant mb-3">
          Reactive ref, changes after mount.
        </p>
        <div
          class="p-2 rounded font-mono text-sm"
          :class="isHydrated ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'"
        >
          {{ hydrationStatus }}
        </div>
        <pre class="mt-3 text-xs text-on-surface-variant">const { isHydrated } = useHydration()
// v-if="isHydrated"</pre>
      </div>
    </div>

    <!-- Browser-only content -->
    <div class="p-4 bg-surface border border-divider rounded-lg">
      <h3 class="text-sm font-semibold mb-3">Browser-only content</h3>
      <div v-if="isHydrated" class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-on-surface-variant">Window width:</span>
          <span class="font-mono">{{ windowWidth }}px</span>
        </div>
        <div class="flex justify-between">
          <span class="text-on-surface-variant">User agent:</span>
          <span class="font-mono text-xs">{{ userAgent }}</span>
        </div>
      </div>
      <div v-else class="text-sm text-on-surface-variant italic">
        Loading browser data...
      </div>
    </div>
  </div>
</template>
