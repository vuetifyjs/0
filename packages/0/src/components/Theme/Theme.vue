/**
 * @module Theme
 *
 * @remarks
 * Scoped theme provider component. Wraps children in a theme context
 * override so descendant `useTheme()` calls resolve to the specified theme.
 *
 * Supports both wrapper mode (renders a DOM element) and renderless mode
 * (passes attrs via slot scope).
 *
 * @see https://0.vuetifyjs.com/components/providers/theme
 */

<script lang="ts">
  // Composables
  import { provideContext } from '#v0/composables/createContext'
  import { useTheme } from '#v0/composables/useTheme'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DOMElement } from '#v0/types'

  export interface ThemeProps {
    /**
     * Theme ID to scope to
     */
    theme: string
    /**
     * Skip wrapper element, pass attrs via slot
     *
     * @default false
     */
    renderless?: boolean
    /**
     * Wrapper element tag
     *
     * @default 'div'
     */
    as?: DOMElement
  }

  export interface ThemeSlotProps {
    /** Attributes including data-theme for binding */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Theme', inheritAttrs: false })

  defineSlots<{
    default: (props: ThemeSlotProps) => any
  }>()

  const {
    theme,
    renderless = false,
    as = 'div',
  } = defineProps<ThemeProps>()

  const parent = useTheme()

  const selectedId = toRef(() => theme)
  const selectedItem = toRef(() => parent.get(theme))
  const isDark = toRef(() => selectedItem.value?.dark ?? false)

  const scoped = {
    ...parent,
    selectedId,
    selectedItem,
    isDark,
  }

  provideContext('v0:theme', scoped)

  const attrs = toRef((): Record<string, unknown> => ({
    'data-theme': theme,
  }))
</script>

<template>
  <slot
    v-if="renderless"
    :attrs
  />

  <component
    :is="as"
    v-else
    v-bind="attrs"
  >
    <slot :attrs />
  </component>
</template>
