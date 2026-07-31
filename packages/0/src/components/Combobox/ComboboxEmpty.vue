/**
 * @module ComboboxEmpty
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Conditional render when no items match the current query. Automatically
 * shown when `context.isEmpty` is true. Exposes the current query string
 * via slot props for custom empty state messages.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useComboboxContext } from './ComboboxRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ComboboxEmptyProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface ComboboxEmptySlotProps {
    /** Current query string */
    query: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxEmpty' })

  defineSlots<{
    default: (props: ComboboxEmptySlotProps) => any
  }>()

  const {
    as = 'div',
    namespace = 'v0:combobox',
    renderless,
  } = defineProps<ComboboxEmptyProps>()

  const context = useComboboxContext(namespace)
  const locale = useLocale()

  const slotProps = toRef((): ComboboxEmptySlotProps => ({
    query: context.query.value,
  }))
</script>

<template>
  <Atom v-if="context.isEmpty.value" :as :renderless>
    <slot v-bind="slotProps">{{ locale.ti('Combobox.noResults') ?? 'No results' }}</slot>
  </Atom>
</template>
