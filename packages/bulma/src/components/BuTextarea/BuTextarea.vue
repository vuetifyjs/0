/**
 * @module BuTextarea
 *
 * @remarks
 * Bulma `.textarea` — a renderless `Input.Root` around `Input.Control`
 * rendered as a native textarea element. Inside an existing `Input.Root`
 * scope the wrapper is skipped and the control binds to the ambient context
 * instead. In that ambient mode the root owns the entire behavioral surface:
 * `v-model`, `disabled`, `readonly`, `required`, `name`, `form`, `id`,
 * `label`, and all validation props passed to BuTextarea are ignored — only
 * the presentational modifiers (`color`, `size`, `fixed`) still apply.
 */

<script lang="ts">
  // Framework
  import { InputControl, InputRoot, useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { ID, InputRootContext, InputRootProps } from '@vuetify/v0'

  export type BuTextareaColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  export type BuTextareaSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuTextareaProps {
    /** Color modifier: `is-{color}` */
    color?: BuTextareaColor
    /** Disables the textarea */
    disabled?: boolean
    /** Manual error state override — forces `is-danger` */
    error?: boolean
    /** Manual error messages — merged with rule-based errors */
    errorMessages?: InputRootProps['errorMessages']
    /** Disable resizing: `has-fixed-size` */
    fixed?: boolean
    /** Associate with a form by id */
    form?: string
    /** Unique identifier (auto-generated when omitted) */
    id?: ID
    /** Accessible label */
    label?: string
    /** Form field name */
    name?: string
    /** Namespace of the Input.Root context */
    namespace?: string
    /** Makes the textarea readonly */
    readonly?: boolean
    /** Marks the textarea required */
    required?: boolean
    /** Validation rules */
    rules?: InputRootProps['rules']
    /** Size modifier: `is-{size}` (emitted only when passed) */
    size?: BuTextareaSize
    /** When to trigger validation (v0 default: blur) */
    validateOn?: InputRootProps['validateOn']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuTextarea', inheritAttrs: false })

  const attrs = useAttrs()

  defineEmits<{
    'update:model-value': [value: string]
    'update:focused': [value: boolean]
  }>()

  const {
    color,
    disabled = false,
    error = false,
    errorMessages,
    fixed = false,
    form,
    id,
    label,
    name,
    namespace = 'v0:input:root',
    readonly = false,
    required,
    rules,
    size,
    validateOn,
  } = defineProps<BuTextareaProps>()

  const model = defineModel<string>({ default: '' })
  const focused = defineModel<boolean>('focused', { default: false })

  // Optional injection: inside an ambient Input.Root the control binds to it
  // directly and no second root is created (a nested root would shadow it).
  // A null default returns instead of throwing — only undefined throws.
  const root = useInputRoot(namespace, null as unknown as InputRootContext) as InputRootContext | null

  if (root) {
    watch(root.isFocused, value => {
      focused.value = value
    })
  }

  const classes = toRef(() => [
    color && `is-${color}`,
    size && `is-${size}`,
    fixed && 'has-fixed-size',
  ])
</script>

<template>
  <InputRoot
    v-if="!root"
    :id
    v-slot="{ isValid }"
    v-model="model"
    v-model:focused="focused"
    :disabled
    :error
    :error-messages
    :form
    :label
    :name
    :namespace
    :readonly
    renderless
    :required
    :rules
    :validate-on
  >
    <InputControl
      v-bind="attrs"
      as="textarea"
      class="textarea"
      :class="[classes, { 'is-danger': isValid === false }]"
      :namespace
    />
  </InputRoot>

  <InputControl
    v-else
    v-bind="attrs"
    as="textarea"
    class="textarea"
    :class="[classes, { 'is-danger': root.isValid.value === false }]"
    :namespace
  />
</template>
