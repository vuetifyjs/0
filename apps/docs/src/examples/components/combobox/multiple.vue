<script setup lang="ts">
  import { Combobox } from '@vuetify/v0'
  import { ref } from 'vue'

  const selected = ref<string[]>([])

  const languages = [
    { id: 'ts', label: 'TypeScript' },
    { id: 'js', label: 'JavaScript' },
    { id: 'py', label: 'Python' },
    { id: 'rust', label: 'Rust' },
    { id: 'go', label: 'Go' },
    { id: 'java', label: 'Java' },
    { id: 'swift', label: 'Swift' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <Combobox.Root v-model="selected" multiple>
      <Combobox.Activator class="flex items-center gap-1 flex-wrap w-full min-h-10 px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm">
        <span
          v-for="label in selected"
          :key="label"
          class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-medium"
        >
          {{ label }}
        </span>

        <Combobox.Input
          class="flex-1 min-w-24 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search languages…"
        />

        <Combobox.Cue v-slot="{ isOpen }" class="text-xs opacity-50 cursor-pointer ms-auto">
          {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
        </Combobox.Cue>
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in languages"
          :id="item.id"
          :key="item.id"
          :value="item.label"
        >
          <template #default="{ isSelected, isHighlighted, attrs }">
            <div
              v-bind="attrs"
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
        </Combobox.Item>

        <Combobox.Empty v-slot="{ query }" class="px-3 py-2 text-sm text-on-surface-variant">
          No results for "{{ query }}"
        </Combobox.Empty>
      </Combobox.Content>
    </Combobox.Root>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selected.length > 0 ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
