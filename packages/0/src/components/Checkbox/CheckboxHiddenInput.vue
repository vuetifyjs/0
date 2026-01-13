/**
 * @module CheckboxHiddenInput
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

  // Visually hidden but accessible for form submission
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
  import { useCheckboxRoot } from './CheckboxRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'CheckboxHiddenInput' })

  const {
    namespace = 'v0:checkbox:root',
    name: nameProp,
    value: valueProp,
    form: formProp,
  } = defineProps<CheckboxHiddenInputProps>()

  // Inject context from Checkbox.Root
  const root = useCheckboxRoot(namespace)

  // Use prop if provided, otherwise fall back to context
  const name = toRef(() => nameProp ?? root.name)
  const value = toRef(() => valueProp ?? root.value ?? 'on')
  const form = toRef(() => formProp ?? root.form)

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
    type="checkbox"
    :value="value"
  >
</template>
