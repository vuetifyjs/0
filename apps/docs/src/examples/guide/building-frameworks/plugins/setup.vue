<script setup lang="ts">
  // Composables
  import { useBreakpoints, useTheme } from '@vuetify/v0'
  // Utilities
  import { toRef } from 'vue'

  const theme = useTheme()
  const breakpoints = useBreakpoints()

  const currentTheme = toRef(() => theme.current.value)
  const breakpoint = toRef(() => breakpoints.name.value)
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
            <span class="font-mono">{{ currentTheme?.name ?? 'unknown' }}</span>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              v-for="t in theme.themes.value"
              :key="t.name"
              class="px-2 py-1 text-xs rounded transition-colors"
              :class="currentTheme?.name === t.name
                ? 'bg-primary text-on-primary'
                : 'bg-surface-variant text-on-surface-variant hover:bg-surface'"
              @click="theme.set(t.name)"
            >
              {{ t.name }}
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
            <span class="font-mono">{{ breakpoint }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-on-surface-variant">Width:</span>
            <span class="font-mono">{{ breakpoints.width.value }}px</span>
          </div>
          <div class="flex gap-1 mt-3">
            <span
              v-for="bp in ['xs', 'sm', 'md', 'lg', 'xl']"
              :key="bp"
              class="px-1.5 py-0.5 text-xs rounded"
              :class="breakpoint === bp
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
