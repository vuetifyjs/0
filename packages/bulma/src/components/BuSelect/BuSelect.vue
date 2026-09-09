<script lang="ts">
  // Framework
  import { createInput, isUndefined } from '@vuetify/v0'

  // Utilities
  import { createValidateOn } from '../../utilities/validate'
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { ID, InputOptions, ValidateOn } from '@vuetify/v0'
  import type { StyleValue } from 'vue'

  export type BuSelectColor = 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
  export type BuSelectSize = 'small' | 'normal' | 'medium' | 'large'
  export type BuSelectValue = string | string[] | undefined

  export interface BuSelectProps {
    /** Color modifier rendered as `is-{color}` on the wrapper. */
    color?: BuSelectColor
    /** Disables the native select. */
    disabled?: boolean
    /** Manual error state override — forces invalid. */
    error?: boolean
    /** Manual error messages — merged with rule-based errors. */
    errorMessages?: string | string[]
    /** Associate with a form by id. Snapshotted at setup (createInput takes a plain value). */
    form?: string
    /** Unique identifier for the native select (auto-generated if omitted). Snapshotted at setup. */
    id?: ID
    /** Renders `is-loading` on the wrapper (replaces the dropdown arrow). */
    loading?: boolean
    /** Native multi-select — `is-multiple` on the wrapper plus the `multiple` attr. */
    multiple?: boolean
    /** Form field name. Snapshotted at setup (createInput takes a plain value). */
    name?: string
    /** Whether required. Snapshotted at setup for validation; the DOM attr stays reactive. */
    required?: boolean
    /** Renders `is-rounded` on the wrapper. */
    rounded?: boolean
    /** Native `size` attribute — visible option rows (pairs with `multiple`). */
    rows?: number | string
    /** Validation rules. Snapshotted at setup (createInput takes a plain value). */
    rules?: InputOptions['rules']
    /** Size modifier rendered as `is-{size}` (emitted only when explicitly passed). */
    size?: BuSelectSize
    /** When to trigger validation. */
    validateOn?: ValidateOn
  }

  export interface BuSelectSlotProps {
    /** Merged error messages. */
    errors: string[]
    /** Whether the native select is focused. */
    isFocused: boolean
    /** Whether the field is valid. */
    isValid: boolean | null
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuSelect', inheritAttrs: false })

  // class/style merge onto the div.select wrapper; all other fallthrough
  // attrs (multiple, aria-*, data-testid, …) target the native select.
  const attrs = useAttrs()
  const rest = toRef(() => Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  ))
  const style = toRef(() => attrs.style as StyleValue | undefined)

  defineSlots<{
    default: (props: BuSelectSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: BuSelectValue]
  }>()

  const {
    color,
    disabled = false,
    error = false,
    errorMessages,
    form,
    id,
    loading = false,
    multiple = false,
    name,
    required,
    rounded = false,
    rows,
    rules = [],
    size,
    validateOn = 'blur',
  } = defineProps<BuSelectProps>()

  const model = defineModel<string | string[]>()

  // A native <select multiple> needs an array binding — heal an uncontrolled
  // or undefined model at setup so Vue's vModelSelect doesn't warn on mount.
  if (multiple && isUndefined(model.value)) model.value = []

  const input = createInput<BuSelectValue>({
    value: model,
    id,
    name,
    form,
    required,
    disabled: () => disabled,
    rules,
    error: () => error,
    errorMessages: () => errorMessages,
  })

  const classes = toRef(() => [
    'select',
    {
      'is-danger': input.isValid.value === false,
      'is-loading': loading,
      'is-multiple': multiple,
      'is-rounded': rounded,
    },
    color && `is-${color}`,
    size && `is-${size}`,
  ])

  const slotProps = toRef((): BuSelectSlotProps => ({
    errors: input.errors.value,
    isFocused: input.isFocused.value,
    isValid: input.isValid.value,
  }))

  const { should, onFocus, onBlur } = createValidateOn(input, () => validateOn)

  watch(model, () => {
    if (should('input')) input.validate()
  })
</script>

<template>
  <div :class="[classes, attrs.class]" :style>
    <select
      :id="String(input.id)"
      v-bind="rest"
      v-model="model"
      :aria-invalid="input.isValid.value === false || undefined"
      :disabled="disabled || undefined"
      :form
      :multiple="multiple || undefined"
      :name
      :required="required || undefined"
      :size="rows"
      @blur="onBlur"
      @focus="onFocus"
    >
      <slot v-bind="slotProps" />
    </select>
  </div>
</template>
