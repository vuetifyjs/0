<script setup lang="ts">
  import { Radio } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string>()

  const options = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ]
</script>

<template>
  <Radio.Group v-model="selected" class="flex flex-col gap-2">
    <label
      v-for="option in options"
      :key="option.value"
      class="inline-flex items-center gap-2"
    >
      <Radio.Root
        class="size-5 border rounded-full inline-flex items-center justify-center border-divider data-[state=checked]:border-primary"
        :value="option.value"
      >
        <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
      </Radio.Root>
      <span>{{ option.label }}</span>
    </label>
  </Radio.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected || 'none' }}
  </p>
</template>
