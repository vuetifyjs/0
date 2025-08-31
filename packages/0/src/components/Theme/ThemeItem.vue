<script lang="ts">
  // Composables
  import { useTheme } from '#v0/composables/useTheme'

  // Types
  import type { ThemeContext, ThemeTicket } from '#v0/composables/useTheme'

  export interface ThemeSlots {
    default: (scope: ThemeContext<ThemeTicket>) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ThemeItem' })

  defineSlots<ThemeSlots>()

  const themeContext = useTheme()
</script>

<template>
  <slot v-bind="themeContext" />
</template>
