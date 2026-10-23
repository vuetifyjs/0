<script lang="ts">
  // Framework
  import { Combobox, isNull, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuSearchBar } from './QuSearchBar.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export interface QuSearchBarEmptySlotProps {
    /** What was typed. */
    query: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuSearchBarEmpty' })

  defineSlots<{
    /** The message for a query no suggestion matches. Defaults to "No results". */
    default?: (props: QuSearchBarEmptySlotProps) => any
  }>()

  const context = useQuSearchBar()
  const locale = useLocale()

  orphan('QuSearchBarEmpty', context)

  // Registered so the bar keeps its list open to show this row on no match.
  const release = context?.track()

  onBeforeUnmount(() => release?.())

  // Only a typed query can miss: with nothing typed the list offers history or stays shut.
  const shown = toRef(() => !isNull(context) && context.typing.value)
  const fallback = toRef(() => locale.ti('Quantum.noResults') ?? 'No results')
</script>

<template>
  <Combobox.Empty
    v-if="shown"
    v-slot="{ query }"
    class="quantum-search-bar__empty"
    :namespace="context?.namespace.value"
  >
    <slot :query>{{ fallback }}</slot>
  </Combobox.Empty>
</template>
