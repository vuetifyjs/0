/**
 * @module SelectPlaceholder
 *
 * @see https://0.vuetifyjs.com/components/forms/select
 *
 * @remarks
 * Placeholder text shown when no value is selected. Automatically hides
 * when a selection is made. Typically rendered alongside Select.Value
 * inside the Activator.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useSelectContext } from './SelectRoot.vue'

  // Utilities
  import { isNullOrUndefined } from '#v0/utilities'
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface SelectPlaceholderProps extends AtomProps {
    namespace?: string
  }

  export interface SelectPlaceholderSlotProps {
    hasValue: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'SelectPlaceholder' })

  defineSlots<{
    default: (props: SelectPlaceholderSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:select',
  } = defineProps<SelectPlaceholderProps>()

  const context = useSelectContext(namespace)

  const hasValue = toRef(() =>
    context.selection.selectedIds.size > 0
    || !isNullOrUndefined(context.modelValue.value),
  )
</script>

<template>
  <Atom v-if="!hasValue" :as>
    <slot :has-value />
  </Atom>
</template>
