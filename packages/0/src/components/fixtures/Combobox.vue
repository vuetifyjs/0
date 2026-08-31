<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Combobox } from '../Combobox/index'

  const selected = shallowRef()
  const items = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ]
</script>

<template>
  <Combobox.Root v-model="selected">
    <Combobox.Activator>
      <Combobox.Control placeholder="Search..." />
      <Combobox.Cue />
    </Combobox.Activator>

    <Combobox.Content>
      <!-- Item already binds option attrs on its Atom; do not re-spread. -->
      <Combobox.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :value="item.label"
      >
        {{ item.label }}
      </Combobox.Item>

      <Combobox.Empty>No results found</Combobox.Empty>
    </Combobox.Content>
  </Combobox.Root>
</template>
