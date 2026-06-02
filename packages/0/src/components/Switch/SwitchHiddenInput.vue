/**
 * @module SwitchHiddenInput
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @remarks
 * Hidden native checkbox for form submission. Must be used within a
 * Switch.Root component. Auto-rendered by Root when `name` prop is provided,
 * or can be placed explicitly for custom form integration.
 */

<script lang="ts">
  // Context
  import { useSwitchRoot } from './SwitchRoot.vue'

  // Utilities
  import { isNullOrUndefined, isObject } from '#v0/utilities'
  import { toRef } from 'vue'

  export interface SwitchHiddenInputProps {
    /** Namespace for connecting to parent Switch.Root */
    namespace?: string
    /** Form field name (overrides Root's name) */
    name?: string
    /** Form field value (overrides Root's value, defaults to 'on') */
    value?: string
    /** Associate with form by ID (overrides Root's form) */
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
  defineOptions({ name: 'SwitchHiddenInput' })

  const {
    namespace = 'v0:switch:root',
    name: nameProp,
    value: valueProp,
    form: formProp,
  } = defineProps<SwitchHiddenInputProps>()

  const root = useSwitchRoot(namespace)

  const name = toRef(() => nameProp ?? root.name)
  const form = toRef(() => formProp ?? root.form)

  const value = toRef(() => {
    const v = valueProp ?? root.value ?? 'on'
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
    :form
    inert
    :name
    :style="visuallyHiddenStyle"
    tabindex="-1"
    type="checkbox"
    :value
  >
</template>
