<script setup lang="ts">
  // Framework
  import { Checkbox } from '@vuetify/v0'
  // Utilities
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
    <Checkbox.Root
      v-for="option in options"
      :key="option.value"
      v-slot="{ isChecked }"
      class="flex items-center"
      :value="option.value"
    >
      <Checkbox.Indicator
        class="size-5 border rounded flex items-center justify-center cursor-pointer"
        :class="isChecked ? 'bg-primary border-primary' : 'border-divider'"
      >
        <svg
          v-if="isChecked"
          class="size-3 text-on-primary"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </Checkbox.Indicator>
      <span class="ml-2">{{ option.label }}</span>
    </Checkbox.Root>
  </Checkbox.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.join(', ') || 'none' }}
  </p>
</template>
