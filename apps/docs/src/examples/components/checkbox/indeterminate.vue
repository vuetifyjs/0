<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'
  import { computed, ref } from 'vue'

  const selected = ref<string[]>([])

  const options = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ]

  const allValues = options.map(o => o.value)

  const allSelected = computed(() => allValues.every(v => selected.value.includes(v)))
  const noneSelected = computed(() => selected.value.length === 0)
  const isMixed = computed(() => !allSelected.value && !noneSelected.value)

  function toggleAll () {
    selected.value = allSelected.value ? [] : [...allValues]
  }
</script>

<template>
  <Checkbox.Group v-model="selected" class="flex flex-col gap-2">
    <!-- Parent "Select All" checkbox -->
    <label class="inline-flex items-center gap-2 font-medium">
      <Checkbox.Root
        class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary"
        :indeterminate="isMixed"
        :model-value="allSelected"
        @update:model-value="toggleAll"
      >
        <Checkbox.Indicator class="text-on-primary text-sm">
          <span v-if="isMixed">−</span>
          <span v-else>✓</span>
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span>Select All</span>
    </label>

    <!-- Child checkboxes -->
    <div class="ml-6 flex flex-col gap-2">
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
    </div>
  </Checkbox.Group>

  <p class="mt-4 text-sm text-on-surface-variant">
    Selected: {{ selected.join(', ') || 'none' }}
  </p>
</template>
