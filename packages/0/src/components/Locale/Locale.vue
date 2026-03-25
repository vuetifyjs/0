/**
 * @module Locale
 *
 * @remarks
 * Scoped locale provider component. Wraps children in a locale context
 * override so descendant `useLocale()` calls resolve to the specified locale.
 *
 * Supports both wrapper mode (renders a DOM element) and renderless mode
 * (passes attrs via slot scope).
 *
 * @see https://0.vuetifyjs.com/components/providers/locale
 */

<script lang="ts">
  // Composables
  import { provideContext } from '#v0/composables/createContext'
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DOMElement } from '#v0/types'

  export interface LocaleProps {
    /**
     * Locale ID to scope to
     */
    locale: string
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

  export interface LocaleSlotProps {
    /** Attributes including lang for binding */
    attrs: Record<string, unknown>
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Locale', inheritAttrs: false })

  defineSlots<{
    default: (props: LocaleSlotProps) => any
  }>()

  const {
    locale,
    renderless = false,
    as = 'div',
  } = defineProps<LocaleProps>()

  const parent = useLocale()

  const selectedId = toRef(() => locale)
  const selectedItem = toRef(() => parent.get(locale))

  const scoped = {
    ...parent,
    selectedId,
    selectedItem,
  }

  provideContext('v0:locale', scoped)

  const attrs = toRef((): Record<string, unknown> => ({
    'data-locale': locale,
    'lang': locale,
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
