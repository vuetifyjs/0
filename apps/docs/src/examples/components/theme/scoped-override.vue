<script setup lang="ts">
  import { createThemeContext, Theme } from '@vuetify/v0'
  import ThemeCard from './ThemeCard.vue'

  const [, provideTheme] = createThemeContext({
    default: 'light',
    themes: {
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
    },
  })

  provideTheme()
</script>

<template>
  <div class="space-y-6">
    <!-- Root context uses the default theme (light) -->
    <div class="space-y-2">
      <p class="text-sm text-on-surface-variant">Root context (light)</p>
      <ThemeCard />
    </div>

    <!-- Scoped override to dark -->
    <Theme theme="dark">
      <div class="rounded-lg border border-divider overflow-hidden">
        <div class="px-4 py-2 bg-surface-variant">
          <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Scoped to dark
          </span>
        </div>

        <div class="p-4 space-y-3">
          <ThemeCard theme="dark" />

          <!-- Nested override back to light inside dark -->
          <Theme theme="light">
            <div class="rounded-lg border border-divider overflow-hidden">
              <div class="px-4 py-2 bg-surface-variant">
                <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                  Nested back to light
                </span>
              </div>

              <div class="p-4">
                <ThemeCard theme="light" />
              </div>
            </div>
          </Theme>
        </div>
      </div>
    </Theme>

    <!-- Another scoped override to dark, independent of the above -->
    <Theme theme="dark">
      <div class="rounded-lg border border-divider overflow-hidden">
        <div class="px-4 py-2 bg-surface-variant">
          <span class="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
            Independent dark scope
          </span>
        </div>

        <div class="p-4">
          <ThemeCard theme="dark" />
        </div>
      </div>
    </Theme>
  </div>
</template>
