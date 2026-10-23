<script lang="ts">
  // Framework
  import { Combobox, isNull, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1SearchBar } from './Md1SearchBar.vue'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

  export interface Md1SearchBarEmptySlotProps {
    /** What was typed. */
    query: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1SearchBarEmpty' })

  defineSlots<{
    /** The message for a query no suggestion matches. Defaults to "No results". */
    default?: (props: Md1SearchBarEmptySlotProps) => any
  }>()

  const context = useMd1SearchBar()
  const locale = useLocale()

  orphan('Md1SearchBarEmpty', context)

  // Registered so the bar keeps its list open to show this row on no match.
  const release = context?.track()

  onBeforeUnmount(() => release?.())

  // Only a typed query can miss: with nothing typed the list offers history or stays shut.
  const shown = toRef(() => !isNull(context) && context.typing.value)
  const fallback = toRef(() => locale.ti('Md1.noResults') ?? 'No results')
</script>

<template>
  <Combobox.Empty
    v-if="shown"
    v-slot="{ query }"
    class="md1-search-bar__empty"
    :namespace="context?.namespace.value"
  >
    <slot :query>{{ fallback }}</slot>
  </Combobox.Empty>
</template>
