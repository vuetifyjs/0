<script setup lang="ts">
  import { toRef } from 'vue'

  const { theme = 'light' } = defineProps<{
    theme?: string
  }>()

  const themes: Record<string, { dark: boolean, colors: Record<string, string> }> = {
    light: {
      dark: false,
      colors: {
        primary: '#1867C0',
        secondary: '#5CBBF6',
        surface: '#FFFFFF',
        background: '#F5F5F5',
      },
    },
    dark: {
      dark: true,
      colors: {
        primary: '#2196F3',
        secondary: '#424242',
        surface: '#1E1E1E',
        background: '#121212',
      },
    },
  }

  const current = toRef(() => themes[theme] ?? themes.light)
</script>

<template>
  <div
    class="rounded-lg border border-divider p-4 space-y-3"
    :style="{ backgroundColor: current.colors.surface, color: current.colors.primary }"
  >
    <div class="flex items-center gap-2">
      <span class="font-medium">{{ theme }}</span>

      <span
        class="text-xs px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant"
      >
        {{ current.dark ? 'dark' : 'light' }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <div
        v-for="(value, key) in current.colors"
        :key
        class="flex items-center gap-1.5"
      >
        <span
          class="size-4 rounded-sm border border-divider shrink-0"
          :style="{ backgroundColor: value }"
        />

        <span class="text-xs font-mono opacity-70">{{ key }}</span>
      </div>
    </div>
  </div>
</template>
