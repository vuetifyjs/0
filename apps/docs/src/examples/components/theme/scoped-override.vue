<script setup lang="ts">
  import { createThemeContext } from '@vuetify/v0'
  import ThemeCard from './ThemeCard.vue'
  import ThemeSection from './ThemeSection.vue'

  const [provideTheme] = createThemeContext({
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
    <ThemeSection label="Scoped to dark" theme="dark">
      <ThemeCard />

      <!-- Nested override back to light inside dark -->
      <ThemeSection label="Nested back to light" theme="light">
        <ThemeCard />
      </ThemeSection>
    </ThemeSection>

    <!-- Another scoped override to dark, independent of the above -->
    <ThemeSection label="Independent dark scope" theme="dark">
      <ThemeCard />
    </ThemeSection>
  </div>
</template>
