<script setup lang="ts">
  import { Combobox } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()

  const fruits = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'date', label: 'Date' },
    { id: 'elderberry', label: 'Elderberry' },
    { id: 'fig', label: 'Fig' },
    { id: 'grape', label: 'Grape' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Combobox.Root v-model="selected">
      <Combobox.Activator class="flex items-center gap-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm">
        <Combobox.Input
          class="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search fruits…"
        />
        <Combobox.Cue class="text-xs opacity-50 cursor-pointer" />
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in fruits"
          :id="item.id"
          :key="item.id"
          class="px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[selected]:font-medium data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
          :value="item.label"
        >
          {{ item.label }}
        </Combobox.Item>

        <Combobox.Empty v-slot="{ query }" class="px-3 py-2 text-sm text-on-surface-variant">
          No results for "{{ query }}"
        </Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
