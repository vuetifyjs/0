<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ]
</script>

<template>
  <Checkbox.Group v-model="selected" class="flex flex-col gap-2">
    <label
      v-for="option in options"
      :key="option.value"
      class="inline-flex items-center gap-2"
    >
      <Checkbox.Root
        class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        :value="option.value"
      >
        <Checkbox.Indicator class="text-on-primary text-sm">✓</Checkbox.Indicator>
      </Checkbox.Root>
      <span>{{ option.label }}</span>
    </label>
  </Checkbox.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.join(', ') || 'none' }}
  </p>
</template>
