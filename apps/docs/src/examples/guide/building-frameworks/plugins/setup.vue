<script setup lang="ts">
  import { useBreakpoints, useTheme } from '@vuetify/v0'

  const theme = useTheme()
  const breakpoints = useBreakpoints()
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-on-surface-variant">
      Access v0 plugins anywhere in your component tree:
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <!-- Theme info -->
      <div class="p-4 bg-surface border border-divider rounded-lg">
        <h3 class="text-sm font-semibold mb-3">useTheme()</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-on-surface-variant">Current:</span>
            <span class="font-mono">{{ theme.selectedId?.value ?? 'none' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-on-surface-variant">Dark mode:</span>
            <span class="font-mono">{{ theme.isDark?.value ?? false }}</span>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              class="px-2 py-1 text-xs rounded transition-colors bg-surface-variant text-on-surface-variant hover:bg-surface"
              @click="theme.cycle(['light', 'dark'])"
            >
              Toggle theme
            </button>
          </div>
        </div>
      </div>

      <!-- Breakpoints info -->
      <div class="p-4 bg-surface border border-divider rounded-lg">
        <h3 class="text-sm font-semibold mb-3">useBreakpoints()</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-on-surface-variant">Current:</span>
            <span class="font-mono">{{ breakpoints.name?.value ?? 'unknown' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-on-surface-variant">Width:</span>
            <span class="font-mono">{{ breakpoints.width?.value ?? 0 }}px</span>
          </div>
          <div class="flex gap-1 mt-3">
            <span
              v-for="bp in ['xs', 'sm', 'md', 'lg', 'xl']"
              :key="bp"
              class="px-1.5 py-0.5 text-xs rounded"
              :class="breakpoints.name?.value === bp
                ? 'bg-primary text-on-primary'
                : 'bg-surface-variant text-on-surface-variant'"
            >
              {{ bp }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="p-3 bg-surface-variant rounded-lg">
      <p class="text-xs text-on-surface-variant font-mono">
        // plugins/index.ts<br>
        app.use(createThemePlugin({ ... }))<br>
        app.use(createBreakpointsPlugin({ ... }))
      </p>
    </div>
  </div>
</template>
