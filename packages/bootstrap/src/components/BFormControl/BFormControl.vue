<script lang="ts">
  // Framework
  import { createInput, isElement, isNullOrUndefined, isNumber, isString, isUndefined } from '@vuetify/v0'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  export type BFormControlSize = 'sm' | 'lg'

  export type BFormControlTag = 'input' | 'textarea' | 'select'

  export interface BFormControlProps {
    /**
     * Host element. A select stays `.form-control`. It does not become `.form-select`.
     *
     * @default 'input'
     */
    as?: BFormControlTag
    /**
     * `sm` / `lg` add `.form-control-sm` / `.form-control-lg`.
     * A number is the native select `size` attribute, not a class.
     */
    size?: BFormControlSize | number
    /**
     * Adds `.is-invalid`.
     *
     * @default false
     */
    invalid?: boolean
    /**
     * Adds `.is-valid`.
     *
     * @default false
     */
    valid?: boolean
    /**
     * With `readonly`, adds `.form-control-plaintext`.
     *
     * @default false
     */
    plaintext?: boolean
    /**
     * Control id. `createInput` generates one with `useId` when this is omitted.
     */
    id?: string
    /**
     * Native input type. Omitted on textarea and select.
     */
    type?: string
    /**
     * @default false
     */
    disabled?: boolean
    /**
     * @default false
     */
    readonly?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormControl', inheritAttrs: false })

  defineSlots<{
    /** Options, when `as` is `select`. */
    default?: () => any
  }>()

  defineEmits(['update:model-value'])

  const model = defineModel<string>({ default: '' })

  const {
    as = 'input',
    size,
    invalid = false,
    valid = false,
    plaintext = false,
    id,
    type,
    disabled = false,
    readonly = false,
  } = defineProps<BFormControlProps>()

  const attrs = useAttrs()
  const control = useTemplateRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('control')

  const field = createInput({
    value: model,
    id,
    disabled: () => disabled,
    readonly: () => readonly,
  })

  watch(model, value => {
    const node = control.value
    if (isNullOrUndefined(node)) return
    if (node.value === value) return
    node.value = value
  })

  function classes () {
    const list = ['form-control']

    if (size === 'sm') list.push('form-control-sm')
    if (size === 'lg') list.push('form-control-lg')
    if (invalid) list.push('is-invalid')
    if (valid) list.push('is-valid')
    if (plaintext && field.isReadonly.value) list.push('form-control-plaintext')

    return list
  }

  function readValue (event: Event) {
    const target = event.target
    if (!isElement(target) || !('value' in target)) return undefined
    const value = target.value
    if (!isString(value)) return undefined
    return value
  }

  function onInput (event: Event) {
    const next = readValue(event)
    if (isUndefined(next)) return
    model.value = next
  }

  function onFocus () {
    field.isFocused.value = true
  }

  function onBlur () {
    field.isFocused.value = false
    field.isTouched.value = true
  }

  const bindings = toRef(() => mergeProps(attrs, {
    'id': field.id,
    'class': classes(),
    'type': as === 'input' ? type : undefined,
    'size': isNumber(size) ? size : undefined,
    'disabled': field.isDisabled.value || undefined,
    'readonly': field.isReadonly.value || undefined,
    'aria-invalid': invalid ? true : undefined,
    'value': model.value === '' ? undefined : model.value,
    'onBlur': onBlur,
    'onFocus': onFocus,
    'onInput': onInput,
  }))
</script>

<template>
  <input
    v-if="as === 'input'"
    ref="control"
    v-bind="bindings"
  >

  <textarea
    v-else-if="as === 'textarea'"
    ref="control"
    v-bind="bindings"
  />

  <select
    v-else
    ref="control"
    v-bind="bindings"
  >
    <slot />
  </select>
</template>
