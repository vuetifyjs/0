/**
 * @module Theme
 *
 * @remarks
 * Scoped theme provider component.
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { ID } from '#v0/types'

  export interface ThemeProps extends AtomProps {
    theme?: ID
    namespace?: string
  }

  export interface ThemeSlotProps {
    theme: ID | null | undefined
    isDark: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Foundational
  import { provideContext } from '#v0/composables/createContext'

  // Composables
  import { useTheme } from '#v0/composables/useTheme'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'Theme', inheritAttrs: false })

  defineSlots<{
    default: (props: ThemeSlotProps) => any
  }>()

  const {
    as = 'div',
    theme,
    namespace = 'v0:theme',
  } = defineProps<ThemeProps>()

  const parent = useTheme()

  const selectedId = toRef(() => theme ?? parent.selectedId.value)
  const isDark = toRef(() => {
    if (!selectedId.value) return parent.isDark.value
    const ticket = parent.get(selectedId.value)
    return ticket?.dark ?? parent.isDark.value
  })

  const context = {
    ...parent,
    selectedId,
    isDark,
    selectedItem: toRef(() => {
      if (!selectedId.value) return parent.selectedItem.value
      return parent.get(selectedId.value) ?? parent.selectedItem.value
    }),
    selectedIndex: toRef(() => {
      if (!selectedId.value) return parent.selectedIndex.value
      return parent.get(selectedId.value)?.index ?? -1
    }),
    selectedValue: toRef(() => {
      if (!selectedId.value) return parent.selectedValue.value
      return parent.get(selectedId.value)?.value
    }),
  }

  provideContext(namespace, context)

  const slotProps = toRef((): ThemeSlotProps => ({
    theme: selectedId.value,
    isDark: isDark.value,
  }))
</script>

<template>
  <Atom
    :as
    :data-theme="selectedId"
    v-bind="$attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
