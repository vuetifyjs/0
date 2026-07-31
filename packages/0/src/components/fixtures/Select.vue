<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Select } from '../Select/index'

  const selected = shallowRef()
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
      <!--
        Item already binds role="option" on its Atom. Do not re-spread attrs onto
        a child — that is the double-fire hazard and produces nested options.
      -->
      <Select.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :value="item.label"
      >
        {{ item.label }}
      </Select.Item>
    </Select.Content>
  </Select.Root>
</template>
