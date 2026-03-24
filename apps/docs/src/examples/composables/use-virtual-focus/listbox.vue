<script setup lang="ts">
  import { shallowRef } from 'vue'
  import Listbox from './Listbox.vue'

  const fruits = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'blueberry', label: 'Blueberry' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'dragonfruit', label: 'Dragon Fruit', disabled: true },
    { id: 'grape', label: 'Grape' },
    { id: 'kiwi', label: 'Kiwi' },
    { id: 'lemon', label: 'Lemon' },
    { id: 'mango', label: 'Mango' },
    { id: 'orange', label: 'Orange' },
    { id: 'peach', label: 'Peach' },
    { id: 'pear', label: 'Pear' },
    { id: 'strawberry', label: 'Strawberry' },
    { id: 'watermelon', label: 'Watermelon' },
  ]

  const selected = shallowRef<string>()

  function onSelect (id: string) {
    selected.value = id
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="w-64">
      <Listbox
        v-model="selected"
        :items="fruits"
        placeholder="Pick a fruit…"
        @select="onSelect"
      />
    </div>

    <p v-if="selected" class="text-sm text-on-surface-variant">
      Selected: <span class="font-semibold text-on-surface">{{ selected }}</span>
    </p>
  </div>
</template>
