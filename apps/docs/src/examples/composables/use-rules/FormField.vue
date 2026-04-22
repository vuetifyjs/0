<script setup lang="ts">
  import type { ValidationContext } from '@vuetify/v0'

  const { validation, label, placeholder, value = '' } = defineProps<{
    validation: ValidationContext
    label: string
    placeholder: string
    value?: string
  }>()

  const emit = defineEmits<{
    input: [value: string]
  }>()

  function onInput (event: Event) {
    emit('input', (event.target as HTMLInputElement).value)
  }
</script>

<template>
  <div>
    <label class="block text-xs font-medium text-on-surface-variant mb-1">
      {{ label }}
    </label>

    <input
      class="w-full px-3 py-1.5 text-sm border rounded bg-surface text-on-surface"
      :class="validation.errors.value.length > 0 ? 'border-error' : 'border-divider'"
      :placeholder
      :value
      @input="onInput"
    >

    <p
      class="mt-0.5 text-xs truncate"
      :class="validation.errors.value.length > 0 ? 'text-error' : 'text-transparent'"
    >
      {{ validation.errors.value[0] || '&nbsp;' }}
    </p>
  </div>
</template>
