<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()

  function onToggle () {
    theme.select(theme.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <AppIconButton
    :aria-label="theme.isDark.value ? 'Switch to light mode' : 'Switch to dark mode'"
    :icon="theme.isDark.value ? 'theme-light' : 'theme-dark'"
    :title="theme.isDark.value ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="onToggle"
  />
</template>
