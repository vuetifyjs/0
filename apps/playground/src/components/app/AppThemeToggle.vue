<script setup lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()

  function onToggle () {
    theme.select(theme.isDark.value ? 'light' : 'dark')
  }
</script>

<template>
  <AppTooltip
    class="pa-1 inline-flex rounded opacity-50 hover:opacity-80 hover:bg-surface-tint focus-visible:opacity-80 focus-visible:bg-surface-tint focus-visible:outline-none max-md:opacity-80 max-md:bg-surface/50"
    :text="theme.isDark.value ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="onToggle"
  >
    <AppIcon
      aria-hidden="true"
      :icon="theme.isDark.value ? 'theme-light' : 'theme-dark'"
      :size="18"
    />
  </AppTooltip>
</template>
