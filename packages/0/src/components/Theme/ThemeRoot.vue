<script lang="ts">
  // Composables
  import { createTheme } from '#v0/composables/useTheme'

  // Types
  import type { ThemeContext, ThemeItem } from '#v0/composables/useTheme'
  import type { ID } from '#v0/types'

  export interface ThemeRootProps {
    namespace?: string
    themes?: ThemeItem[]
  }

  export interface ThemeRootSlots {
    default: (scope: ThemeContext) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ThemeRoot' })

  defineSlots<ThemeRootSlots>()

  const { namespace = 'v0:theme', themes = [] } = defineProps<ThemeRootProps>()

  const model = defineModel<ID>({ default: 'default' })

  const [provideThemeContext] = createTheme<ThemeContext>(namespace)

  const themeContext = provideThemeContext(model)

  // Register themes from props
  for (const theme of themes) {
    themeContext.register(theme)
  }
</script>

<template>
  <slot v-bind="themeContext" />
</template>
