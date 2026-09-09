<script lang="ts">
  // Framework
  import { createInput } from '@vuetify/v0'

  // Utilities
  import { createValidateOn } from '../../utilities/validate'
  import { toRef, useAttrs, watch } from 'vue'

  // Types
  import type { ID, InputOptions, ValidateOn } from '@vuetify/v0'
  import type { StyleValue } from 'vue'

  export interface BuCheckboxProps {
    /**
     * Disables the checkbox. Mirrors Bulma's documented non-standard `disabled`
     * attribute on the wrapping label in addition to the native input.
     */
    disabled?: boolean
    /** Manual error state override — forces invalid. */
    error?: boolean
    /** Manual error messages — merged with rule-based errors. */
    errorMessages?: string | string[]
    /** Associate with a form by id. Snapshotted at setup (createInput takes a plain value). */
    form?: string
    /** Unique identifier for the native input (auto-generated if omitted). Snapshotted at setup. */
    id?: ID
    /** Form field name. Snapshotted at setup (createInput takes a plain value). */
    name?: string
    /** Whether required. Snapshotted at setup for validation; the DOM attr stays reactive. */
    required?: boolean
    /** Validation rules. Snapshotted at setup (createInput takes a plain value). */
    rules?: InputOptions['rules']
    /** When to trigger validation. */
    validateOn?: ValidateOn
  }

  export interface BuCheckboxSlotProps {
    /** Merged error messages. */
    errors: string[]
    /** Whether the checkbox is checked. */
    isChecked: boolean
    /** Whether the native input is focused. */
    isFocused: boolean
    /** Whether the field is valid. */
    isValid: boolean | null
  }

</script>

<script setup lang="ts">
  defineOptions({ name: 'BuCheckbox', inheritAttrs: false })

  // class/style merge onto the wrapping label; all other fallthrough attrs
  // (aria-*, autofocus, data-testid, …) target the native input.
  const attrs = useAttrs()
  const rest = toRef(() => Object.fromEntries(
    Object.entries(attrs).filter(([key]) => key !== 'class' && key !== 'style'),
  ))
  const style = toRef(() => attrs.style as StyleValue | undefined)

  defineSlots<{
    default: (props: BuCheckboxSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    disabled = false,
    error = false,
    errorMessages,
    form,
    id,
    name,
    required,
    rules = [],
    validateOn = 'blur',
  } = defineProps<BuCheckboxProps>()

  const model = defineModel<boolean>({ default: false })

  const input = createInput<boolean>({
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

  const slotProps = toRef((): BuCheckboxSlotProps => ({
    errors: input.errors.value,
    isChecked: model.value,
    isFocused: input.isFocused.value,
    isValid: input.isValid.value,
  }))

  const { should, onFocus, onBlur } = createValidateOn(input, () => validateOn)

  watch(model, () => {
    if (should('input')) input.validate()
  })
</script>

<template>
  <!-- Bulma documents the non-standard label[disabled]; '' matches native boolean-attr serialization. -->
  <label
    class="checkbox"
    :class="attrs.class"
    :disabled="disabled ? '' : undefined"
    :style
  >
    <input
      :id="String(input.id)"
      v-bind="rest"
      v-model="model"
      :aria-invalid="input.isValid.value === false || undefined"
      :disabled="disabled || undefined"
      :form
      :name
      :required="required || undefined"
      type="checkbox"
      @blur="onBlur"
      @focus="onFocus"
    >

    <slot v-bind="slotProps" />
  </label>
</template>
