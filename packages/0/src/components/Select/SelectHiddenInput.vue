/**
 * @module SelectHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/select
 *
 * @remarks
 * Hidden native input for form submission. Internal component — not exported.
 * Auto-rendered by SelectRoot when `name` prop is provided. Renders one hidden
 * input per selected value for multi-select support.
 */

<script lang="ts">
  // Context
  import { useSelectContext } from './SelectRoot.vue'

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

  defineOptions({ name: 'SelectHiddenInput' })

  const {
    namespace = 'v0:select',
  } = defineProps<{ namespace?: string }>()

  const context = useSelectContext(namespace)

  const values = toRef(() => {
    return Array.from(context.selection.selectedValues.value).map(v => {
      if (isNullOrUndefined(v)) return ''
      if (isObject(v)) return JSON.stringify(v)
      return String(v)
    })
  })

  const isDisabled = toRef(() => toValue(context.disabled))
</script>

<template>
  <input
    v-for="(val, index) in values"
    :key="index"
    :disabled="isDisabled"
    :form="context.form"
    inert
    :name="context.name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="hidden"
    :value="val"
  >
</template>
