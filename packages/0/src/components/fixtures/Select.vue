<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Select } from '../Select/index'

  const selected = ref()
  const items = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ]
</script>

<template>
  <Select.Root v-model="selected">
    <Select.Activator>
      <Select.Value v-slot="{ selectedValue }">{{ selectedValue }}</Select.Value>
      <Select.Placeholder>Pick a fruit</Select.Placeholder>
    </Select.Activator>

    <Select.Content>
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        v-slot="{ attrs }"
        :value="item.label"
      >
        <div v-bind="attrs">{{ item.label }}</div>
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>
