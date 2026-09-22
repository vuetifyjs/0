/**
 * @module ComboboxHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/combobox
 *
 * @remarks
 * Hidden native input for form submission. Internal component — not exported.
 * Auto-rendered by ComboboxRoot when `name` prop is provided. Renders one hidden
 * input per selected value for multi-select support.
 */

<script lang="ts">
  // Context
  import { useComboboxRoot } from './ComboboxRoot.vue'

  // Utilities
  import { isNullOrUndefined, isObject } from '#v0/utilities'
  import { toRef, toValue } from 'vue'

  const visuallyHiddenStyle = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  } as const
</script>

<script setup lang="ts">
  defineOptions({ name: 'ComboboxHiddenInput' })

  const {
    namespace = 'v0:combobox',
  } = defineProps<{ namespace?: string }>()

  const root = useComboboxRoot(namespace)

  const values = toRef(() => {
    return Array.from(root.selection.selectedValues.value).map(v => {
      if (isNullOrUndefined(v)) return ''
      if (isObject(v)) return JSON.stringify(v)
      return String(v)
    })
  })

  const isDisabled = toRef(() => toValue(root.disabled))
</script>

<template>
  <input
    v-for="(val, index) in values"
    :key="index"
    :disabled="isDisabled"
    :form="root.form"
    inert
    :name="root.name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="hidden"
    :value="val"
  >
</template>
