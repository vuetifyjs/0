<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { InputRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { FormValidationRule, ValidateOn } from '@vuetify/v0'
  import type { MaybeRefOrGetter } from 'vue'

  export interface EmTextFieldProps extends V0PaperProps {
    disabled?: MaybeRefOrGetter<boolean>
    readonly?: MaybeRefOrGetter<boolean>
    required?: boolean
    name?: string
    label?: string
    type?: string
    rules?: FormValidationRule[]
    validateOn?: ValidateOn
    error?: boolean
    errorMessages?: string | string[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextField' })

  const {
    disabled = false,
    readonly: _readonly = false,
    required = false,
    name,
    label,
    type = 'text',
    rules = [],
    validateOn = 'blur',
    error = false,
    errorMessages,
    ...paperProps
  } = defineProps<EmTextFieldProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-text-field"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
  >
    <InputRoot
      v-model="model"
      :disabled
      :error
      :error-messages
      :label
      :name
      :readonly="_readonly"
      :required
      :rules
      :type
      :validate-on
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </InputRoot>
  </V0Paper>
</template>

<style>
.emerald-text-field {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
}

.emerald-text-field[data-error] .emerald-text-field__label {
  color: var(--emerald-error-700, #b8302a);
}

.emerald-text-field[data-disabled] {
  pointer-events: none;
}
</style>
