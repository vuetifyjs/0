<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Combobox } from '../../Combobox/index'

  const selected = ref()
  const items = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
  ]
</script>

<template>
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
        v-slot="{ attrs }"
        :value="item.label"
      >
        <div v-bind="attrs">{{ item.label }}</div>
      </Combobox.Item>
    </Combobox.Content>
  </Combobox.Root>
</template>
