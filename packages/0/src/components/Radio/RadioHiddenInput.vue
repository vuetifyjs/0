/**
 * @module RadioHiddenInput
 *
 * @remarks
 * Hidden native radio input for form submission. Must be used within a
 * Radio.Root component. Auto-rendered by Root when `name` prop is provided,
 * or can be placed explicitly for custom form integration.
 */

<script lang="ts">
  export interface RadioHiddenInputProps {
    /** Namespace for context injection from parent Radio.Root */
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
  // Components
  import { useRadioRoot } from './RadioRoot.vue'

  // Utilities
  import { isObject } from '#v0/utilities'
  import { toRef } from 'vue'

  defineOptions({ name: 'RadioHiddenInput' })

  const {
    namespace = 'v0:radio:root',
    name: _name,
    value: _value,
    form: _form,
  } = defineProps<RadioHiddenInputProps>()

  const root = useRadioRoot(namespace)

  const name = toRef(() => _name ?? root.name)
  const form = toRef(() => _form ?? root.form)

  // Serialize complex values for form submission - objects become JSON strings
  const value = toRef(() => {
    const v = _value ?? root.value ?? 'on'
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
    :form="form"
    inert
    :name="name"
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="radio"
    :value="value"
  >
</template>
