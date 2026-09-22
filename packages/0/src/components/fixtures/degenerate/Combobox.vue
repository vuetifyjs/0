<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Combobox } from '../../Combobox/index'

  const selected = shallowRef()
  const items = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ]
</script>

<template>
  <!--
    Degenerate: no accessible name on the control (placeholder dropped).
    Empty omitted so the only intentional omission is naming.
  -->
  <Combobox.Root v-model="selected">
    <Combobox.Activator>
      <Combobox.Control />
      <Combobox.Cue />
    </Combobox.Activator>

    <Combobox.Content>
      <Combobox.Item
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        :value="item.label"
      >
        {{ item.label }}
      </Combobox.Item>
    </Combobox.Content>
  </Combobox.Root>
</template>
