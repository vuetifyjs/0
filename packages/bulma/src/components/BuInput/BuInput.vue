/**
 * @module BuInput
 *
 * @remarks
 * Bulma `.input` — a renderless `Input.Root` around a native `Input.Control`,
 * so no wrapper element lands (Bulma's `.input` is bare-capable). Inside an
 * existing `Input.Root` scope the wrapper is skipped and the control binds to
 * the ambient context instead. In that ambient mode the root owns the entire
 * behavioral surface: `v-model`, `type`, `disabled`, `readonly`, `required`,
 * `name`, `form`, `id`, `label`, and all validation props passed to BuInput
 * are ignored — only the presentational modifiers (`color`, `size`,
 * `rounded`, `plaintext`) still apply, and `plaintext` is then class-only
 * (set `readonly` on the ambient Input.Root for the attribute).
 */

<script lang="ts">
  // Framework
  import { InputControl, InputRoot, useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { ID, InputRootContext, InputRootProps } from '@vuetify/v0'

  export type BuInputColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  export type BuInputSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuInputProps {
    /** Color modifier: `is-{color}` */
    color?: BuInputColor
    /** Disables the input */
    disabled?: boolean
    /** Manual error state override — forces `is-danger` */
    error?: boolean
    /** Manual error messages — merged with rule-based errors */
    errorMessages?: InputRootProps['errorMessages']
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
    /**
     * Static text presentation: `is-static` + readonly. Inside an ambient
     * `Input.Root` this is class-only — the readonly attr is owned by the
     * ambient root (its control attrs always win the merge), so set
     * `readonly` there.
     */
    plaintext?: boolean
    /** Makes the input readonly */
    readonly?: boolean
    /** Marks the input required */
    required?: boolean
    /** Rounded corners: `is-rounded` */
    rounded?: boolean
    /** Validation rules */
    rules?: InputRootProps['rules']
    /** Size modifier: `is-{size}` (emitted only when passed) */
    size?: BuInputSize
    /** Native input type */
    type?: string
    /** When to trigger validation (v0 default: blur) */
    validateOn?: InputRootProps['validateOn']
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuInput', inheritAttrs: false })

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
    form,
    id,
    label,
    name,
    namespace = 'v0:input:root',
    plaintext = false,
    readonly = false,
    required,
    rounded = false,
    rules,
    size,
    type = 'text',
    validateOn,
  } = defineProps<BuInputProps>()

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
    rounded && 'is-rounded',
    plaintext && 'is-static',
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
    :readonly="plaintext || readonly"
    renderless
    :required
    :rules
    :type
    :validate-on
  >
    <InputControl
      v-bind="attrs"
      class="input"
      :class="[classes, { 'is-danger': isValid === false }]"
      :namespace
    />
  </InputRoot>

  <InputControl
    v-else
    v-bind="attrs"
    class="input"
    :class="[classes, { 'is-danger': root.isValid.value === false }]"
    :namespace
  />
</template>
