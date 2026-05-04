/**
 * @module ButtonHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Hidden native input for form submission. Must be used within a
 * Button.Root component. Reads selected state from Root context.
 */

<script lang="ts">
  // Context
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { isObject } from '#v0/utilities'
  import { toRef } from 'vue'

  export interface ButtonHiddenInputProps {
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
    /** Form field name */
    name?: string
    /** Submitted value (defaults to 'on') */
    value?: string
    /** Associate with form by ID */
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
  defineOptions({ name: 'ButtonHiddenInput' })

  const {
    namespace = 'v0:button:root',
    name: _name,
    value: _value,
    form: _form,
  } = defineProps<ButtonHiddenInputProps>()

  const root = useButtonRoot(namespace)

  const name = toRef(() => _name ?? root.name)
  const form = toRef(() => _form ?? root.form)
  const value = toRef(() => {
    const v = _value ?? root.value ?? 'on'
    if (isObject(v)) return JSON.stringify(v)
    return String(v)
  })

  const isSelected = root.isSelected
  const isDisabled = root.isDisabled
</script>

<template>
  <input
    :checked="isSelected"
    :disabled="isDisabled"
    :form
    inert
    :name
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="checkbox"
    :value
  >
</template>
