<script setup lang="ts">
  import { createInput } from '@vuetify/v0'
  import type { FormValidationRule } from '@vuetify/v0'

  const {
    label,
    hint,
    rules = [],
    required = false,
    type = 'text',
    autocomplete,
  } = defineProps<{
    label: string
    hint?: string
    rules?: FormValidationRule[]
    required?: boolean
    type?: string
    autocomplete?: string
  }>()

  const value = defineModel<string>({ default: '' })

  // createInput owns validation, field state, and ARIA IDs — but never DOM
  // events. This component wires focus/blur and decides when to validate.
  const input = createInput({ value, label, rules, required })

  function onFocus () {
    input.isFocused.value = true
  }

  function onBlur () {
    input.isFocused.value = false
    input.isTouched.value = true
    input.validate()
  }

  defineExpose({
    validate: input.validate,
    reset: input.reset,
    isValid: input.isValid,
  })
</script>

<template>
  <div class="flex flex-col gap-1">
    <label class="text-sm font-medium text-on-surface" :for="String(input.id)">
      {{ label }}<span v-if="required" class="text-error"> *</span>
    </label>

    <input
      :id="String(input.id)"
      v-model="value"
      :aria-describedby="input.errors.value.length > 0 ? input.errorId : input.descriptionId"
      :aria-invalid="input.isValid.value === false"
      :autocomplete
      class="px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm outline-none transition-colors data-[state=invalid]:border-error data-[state=valid]:border-success"
      :data-state="input.state.value"
      :type
      @blur="onBlur"
      @focus="onFocus"
    >

    <p
      v-if="input.errors.value.length > 0"
      :id="input.errorId"
      class="text-xs text-error"
    >
      {{ input.errors.value[0] }}
    </p>

    <p
      v-else-if="hint"
      :id="input.descriptionId"
      class="text-xs text-on-surface-variant"
    >
      {{ hint }}
    </p>

    <div class="flex flex-wrap gap-1 text-[10px] text-on-surface-variant">
      <span class="px-1.5 py-0.5 rounded bg-surface-variant data-[on=true]:bg-primary data-[on=true]:text-on-primary" :data-on="input.isDirty.value">dirty</span>
      <span class="px-1.5 py-0.5 rounded bg-surface-variant data-[on=true]:bg-primary data-[on=true]:text-on-primary" :data-on="input.isPristine.value">pristine</span>
      <span class="px-1.5 py-0.5 rounded bg-surface-variant data-[on=true]:bg-primary data-[on=true]:text-on-primary" :data-on="input.isTouched.value">touched</span>
      <span class="px-1.5 py-0.5 rounded bg-surface-variant data-[on=true]:bg-primary data-[on=true]:text-on-primary" :data-on="input.isFocused.value">focused</span>
    </div>
  </div>
</template>
