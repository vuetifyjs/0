<script setup lang="ts">
  import { createInput } from '@vuetify/v0'
  import { ref } from 'vue'

  const value = ref('')
  const input = createInput({
    value,
    rules: [
      (v: string | unknown) => v ? String(v).length > 0 : 'This field is required.',
      (v: string | unknown) => v ? String(v).length > 3 : 'Must be at least 3 characters.',
    ],
  })

  function onFocus () {
    input.isFocused.value = true
  }

  function onBlur () {
    input.isFocused.value = false
    input.isTouched.value = true
    input.validate()
  }
</script>

<template>
  <div class="flex flex-col gap-4 max-w-sm mx-auto p-4">
    <div class="flex flex-col gap-1">
      <label class="text-sm font-medium text-on-surface" :for="String(input.id)">
        Username
      </label>

      <input
        :id="String(input.id)"
        v-model="value"
        :aria-describedby="input.errors.value.length > 0 ? input.errorId : input.descriptionId"
        :aria-invalid="input.isValid.value === false"
        class="px-3 py-2 rounded border bg-surface text-on-surface text-sm focus:outline-none transition-colors"
        :class="{
          'border-error': input.state.value === 'invalid',
          'border-success': input.state.value === 'valid',
          'border-divider': input.state.value === 'pristine',
        }"
        placeholder="Enter username…"
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
        v-else
        :id="input.descriptionId"
        class="text-xs text-on-surface-variant"
      >
        Letters and numbers only.
      </p>
    </div>

    <div class="grid grid-cols-3 gap-2 text-xs text-on-surface-variant border border-divider rounded p-3">
      <div>dirty: <span class="font-mono text-on-surface">{{ input.isDirty.value }}</span></div>
      <div>pristine: <span class="font-mono text-on-surface">{{ input.isPristine.value }}</span></div>
      <div>touched: <span class="font-mono text-on-surface">{{ input.isTouched.value }}</span></div>
      <div>focused: <span class="font-mono text-on-surface">{{ input.isFocused.value }}</span></div>
      <div>valid: <span class="font-mono text-on-surface">{{ input.isValid.value ?? 'null' }}</span></div>
      <div>state: <span class="font-mono text-on-surface">{{ input.state.value }}</span></div>
    </div>

    <button
      class="px-3 py-1.5 rounded border border-divider bg-surface text-on-surface text-sm hover:bg-surface-tint transition-colors"
      @click="input.reset()"
    >
      Reset
    </button>
  </div>
</template>
