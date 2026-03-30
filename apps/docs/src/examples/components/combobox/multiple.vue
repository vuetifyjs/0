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
          v-for="val in selected"
          :key="val"
          class="inline-flex items-center px-2 py-0.5 rounded-full bg-primary text-on-primary text-xs font-medium"
        >
          {{ val }}
        </span>

        <Combobox.Input
          class="flex-1 min-w-24 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search languages…"
        />

        <Combobox.Cue class="text-xs opacity-50 cursor-pointer ms-auto" />
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in languages"
          :id="item.id"
          :key="item.id"
          v-slot="{ isSelected }"
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[highlighted]:bg-primary data-[highlighted]:text-on-primary data-[selected]:text-primary data-[selected]:font-medium"
          :value="item.label"
        >
          <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
          {{ item.label }}
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
