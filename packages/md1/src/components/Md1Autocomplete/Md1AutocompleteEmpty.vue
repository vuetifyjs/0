<script lang="ts">
  // Framework
  import { Combobox, isNull, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Autocomplete } from './context'

  // Utilities
  import { toRef } from 'vue'

  export interface Md1AutocompleteEmptySlotProps {
    /** What was typed. */
    query: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1AutocompleteEmpty' })

  defineSlots<{
    /** The message for a query no suggestion matches. Defaults to "No results". */
    default?: (props: Md1AutocompleteEmptySlotProps) => any
  }>()

  const context = useMd1Autocomplete()
  const locale = useLocale()

  orphan('Md1AutocompleteEmpty', context)

  const active = toRef(() => !isNull(context))
  const fallback = toRef(() => locale.ti('Md1.noResults') ?? 'No results')
</script>

<template>
  <Combobox.Empty
    v-if="active"
    v-slot="{ query }"
    class="md1-autocomplete__empty"
    :namespace="context?.namespace.value"
  >
    <span class="md1-autocomplete__label">
      <slot :query>{{ fallback }}</slot>
    </span>
  </Combobox.Empty>
</template>
