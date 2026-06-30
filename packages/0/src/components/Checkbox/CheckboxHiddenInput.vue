/**
 * @module CheckboxHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/checkbox
 *
 * @remarks
 * Hidden native checkbox for form submission. Must be used within a
 * Checkbox.Root component. Auto-rendered by Root when `name` prop is provided,
 * or can be placed explicitly for custom form integration.
 */

<script lang="ts">
  export interface CheckboxHiddenInputProps {
    /** Namespace for context injection from parent Checkbox.Root */
    namespace?: string
    /** Form field name (defaults to context value) */
    name?: string
    /** Submitted value when checked (defaults to context value or 'on') */
    value?: string
    /** Associate with form by ID (defaults to context value) */
    form?: string
  }

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
  // Context
  import { useCheckboxRoot } from './CheckboxRoot.vue'

  // Utilities
  import { isNullOrUndefined, isObject } from '#v0/utilities'
  import { toRef } from 'vue'

  defineOptions({ name: 'CheckboxHiddenInput' })

  const {
    namespace = 'v0:checkbox:root',
    name,
    value,
    form,
  } = defineProps<CheckboxHiddenInputProps>()

  const root = useCheckboxRoot(namespace)

  const _name = toRef(() => name ?? root.name)
  const _form = toRef(() => form ?? root.form)

  // Serialize complex values for form submission - objects become JSON strings
  const _value = toRef(() => {
    const v = value ?? root.value ?? 'on'
    if (isNullOrUndefined(v)) return 'on'
    if (isObject(v)) return JSON.stringify(v)
    return String(v)
  })

  const isChecked = root.isChecked
  const isDisabled = root.isDisabled
</script>

<template>
  <input
    :checked="isChecked"
    :disabled="isDisabled"
    :form="_form"
    inert
    :name="_name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="checkbox"
    :value="_value"
  >
</template>
