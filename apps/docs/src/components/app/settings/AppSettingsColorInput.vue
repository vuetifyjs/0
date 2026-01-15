<script setup lang="ts">
  defineProps<{
    modelValue: string
    label: string
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  function onColorInput (event: Event) {
    const target = event.target as HTMLInputElement
    emit('update:modelValue', target.value)
  }

  function onTextInput (event: Event) {
    const target = event.target as HTMLInputElement
    let value = target.value.trim()

    // Auto-add # prefix if missing
    if (value && !value.startsWith('#')) {
      value = `#${value}`
    }

    emit('update:modelValue', value)
  }
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-on-surface-variant w-28 shrink-0">{{ label }}</span>
    <input
      :aria-label="`${label} color picker`"
      class="w-6 h-6 rounded cursor-pointer border border-divider shrink-0"
      type="color"
      :value="modelValue"
      @input="onColorInput"
    >
    <input
      :aria-label="`${label} hex value`"
      class="flex-1 min-w-0 px-2 py-1 text-xs rounded border border-divider bg-surface text-on-surface"
      placeholder="#000000"
      type="text"
      :value="modelValue"
      @input="onTextInput"
    >
  </div>
</template>

<style scoped>
  input[type="color"] {
    -webkit-appearance: none;
    appearance: none;
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: 0.25rem;
  }
</style>
