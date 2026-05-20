<script lang="ts">
  // Framework
  import { Atom, InputRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps, FormValidationRule, ValidateOn } from '@vuetify/v0'
  import type { MaybeRefOrGetter } from 'vue'

  export interface EmTextFieldProps extends AtomProps {
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
    as = 'div',
    renderless = false,
  } = defineProps<EmTextFieldProps>()

  const model = defineModel<string>({ default: '' })
</script>

<template>
  <Atom
    :as
    class="emerald-text-field"
    :data-disabled="disabled || undefined"
    :data-error="error || undefined"
    :renderless
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
  </Atom>
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
