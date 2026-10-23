<script lang="ts">
  // Framework
  import { Combobox, isNull, useLocale } from '@vuetify/v0'

  // Context
  import { orphan, useQuAutocomplete } from './context'

  // Utilities
  import { toRef } from 'vue'

  export interface QuAutocompleteEmptySlotProps {
    /** What was typed. */
    query: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuAutocompleteEmpty' })

  defineSlots<{
    /** The message for a query no suggestion matches. Defaults to "No results". */
    default?: (props: QuAutocompleteEmptySlotProps) => any
  }>()

  const context = useQuAutocomplete()
  const locale = useLocale()

  orphan('QuAutocompleteEmpty', context)

  const active = toRef(() => !isNull(context))
  const fallback = toRef(() => locale.ti('Quantum.noResults') ?? 'No results')
</script>

<template>
  <Combobox.Empty
    v-if="active"
    v-slot="{ query }"
    class="quantum-autocomplete__empty"
    :namespace="context?.namespace.value"
  >
    <span class="quantum-autocomplete__label">
      <slot :query>{{ fallback }}</slot>
    </span>
  </Combobox.Empty>
</template>
