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

  interface ScopedLocale {
    _rootT?: (key: string, ...params: unknown[]) => string
    _rootN?: (value: number) => string
  }

  const parent = useLocale()
  const scopedParent = parent as typeof parent & ScopedLocale

  const selectedId = toRef(() => locale)
  const selectedItem = toRef(() => parent.get(locale))

  // Resolve the root t/n (the actual adapter, not a nested Locale wrapper).
  // Each Locale propagates _rootT/_rootN so nested scopes bypass intermediate wrappers.
  const rootT = scopedParent._rootT ?? parent.t
  const rootN = scopedParent._rootN ?? parent.n

  // The adapter's t() reads selectedId from selectedIds. Temporarily swap
  // selectedIds so the adapter resolves messages for the scoped locale.
  function t (key: string, ...params: unknown[]): string {
    const prev = new Set(parent.selectedIds)
    parent.selectedIds.clear()
    parent.selectedIds.add(locale)
    try {
      return rootT(key, ...params)
    } finally {
      parent.selectedIds.clear()
      for (const id of prev) parent.selectedIds.add(id)
    }
  }

  function n (value: number): string {
    const prev = new Set(parent.selectedIds)
    parent.selectedIds.clear()
    parent.selectedIds.add(locale)
    try {
      return rootN(value)
    } finally {
      parent.selectedIds.clear()
      for (const id of prev) parent.selectedIds.add(id)
    }
  }

  const scoped = {
    ...parent,
    selectedId,
    selectedItem,
    t,
    n,
    _rootT: rootT,
    _rootN: rootN,
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
