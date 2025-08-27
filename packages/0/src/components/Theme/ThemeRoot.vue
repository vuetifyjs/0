<script lang="ts">
  // Composables
  import { createTheme } from '#v0/composables/useTheme'

  // Types
  import type { ThemeContext, ThemeTicket } from '#v0/composables/useTheme'
  import type { ID } from '#v0/types'

  export interface ThemeRootProps {
    namespace?: string
    themes?: ThemeTicket[]
  }

  export interface ThemeRootSlots {
    default: (scope: ThemeContext<ThemeTicket>) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ThemeRoot' })

  defineSlots<ThemeRootSlots>()

  const { namespace = 'v0:theme', themes = [] } = defineProps<ThemeRootProps>()

  const model = defineModel<ID>({ default: 'default' })

  const [provideThemeContext] = createTheme(namespace)

  const themeContext = provideThemeContext()

  // Register themes from props
  for (const theme of themes) {
    themeContext.register(theme)
  }
</script>

<template>
  <slot v-bind="themeContext" />
</template>
