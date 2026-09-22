<script setup lang="ts">
  import { createTheme } from '@vuetify/v0'
  import { Theme } from '@vuetify/v0/components'

  const theme = createTheme({
    default: 'light',
    system: { light: 'light', dark: 'dark' },
    themes: {
      light: {
        dark: false,
        colors: {
          'primary': '#3b82f6',
          'surface': '#ffffff',
          'on-surface': '#111111',
        },
      },
      dark: {
        dark: true,
        colors: {
          'primary': '#675496',
          'surface': '#1e1e1e',
          'on-surface': '#eeeeee',
        },
      },
    },
  })
</script>

<template>
  <Theme :theme="theme.selectedId.value">
    <div class="flex flex-col gap-3 pa-4 rounded bg-surface text-on-surface">
      <p class="text-sm">
        selected: <code>{{ theme.selectedId }}</code>
        · isSystem: <code>{{ theme.isSystem }}</code>
      </p>

      <p class="text-xs text-on-surface-variant">
        Flip the OS / browser color scheme while isSystem is true. Select locks it; Reset follows the OS again.
      </p>

      <div class="flex gap-2">
        <button class="px-3 py-1 rounded bg-primary text-white text-sm" type="button" @click="theme.select('light')">
          Light
        </button>

        <button class="px-3 py-1 rounded bg-primary text-white text-sm" type="button" @click="theme.select('dark')">
          Dark
        </button>

        <button class="px-3 py-1 rounded border border-divider text-sm" type="button" @click="theme.reset()">
          Reset
        </button>
      </div>
    </div>
  </Theme>
</template>
