<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const fruits = [
    { id: 'apple', label: 'Apple' },
    { id: 'banana', label: 'Banana' },
    { id: 'cherry', label: 'Cherry' },
    { id: 'mango', label: 'Mango' },
    { id: 'peach', label: 'Peach' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Select.Root v-model="selected" multiple>
      <Select.Activator class="flex items-center gap-1 flex-wrap w-full min-h-10 px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
        <Select.Value v-slot="{ selectedValues }">
          <span
            v-for="value in selectedValues"
            :key="String(value)"
            class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-medium"
          >
            {{ value }}
          </span>
        </Select.Value>
        <Select.Placeholder class="text-on-surface-variant">Choose fruits…</Select.Placeholder>

        <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50 ms-auto">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Select.Cue>
      </Select.Activator>

      <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Select.Item
          v-for="item in fruits"
          :id="item.id"
          :key="item.id"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted }">
            <div
              class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
              :class="[
                isHighlighted
                  ? 'bg-primary text-on-primary'
                  : isSelected
                    ? 'text-primary font-medium'
                    : 'text-on-surface hover:bg-surface-variant',
              ]"
            >
              <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
              {{ item.label }}
            </div>
          </template>
        </Select.Item>
      </Select.Content>
    </Select.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
