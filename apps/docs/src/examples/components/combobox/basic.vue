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
        <Combobox.Cue v-slot="{ isOpen }" class="text-xs opacity-50 cursor-pointer">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in fruits"
          :id="item.id"
          :key="item.id"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted, attrs }">
            <div
              v-bind="attrs"
              class="px-3 py-2 rounded-md cursor-default select-none text-sm"
              :class="[
                isHighlighted
                  ? 'bg-primary text-on-primary'
                  : isSelected
                    ? 'text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-variant',
              ]"
            >
              {{ item.label }}
            </div>
          </template>
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
