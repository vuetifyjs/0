<script setup lang="ts">
  import { Combobox } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const selected = shallowRef<string>()

  const countries = [
    { id: 'us', label: 'United States' },
    { id: 'ca', label: 'Canada' },
    { id: 'gb', label: 'United Kingdom' },
    { id: 'au', label: 'Australia' },
    { id: 'de', label: 'Germany' },
    { id: 'fr', label: 'France' },
    { id: 'jp', label: 'Japan' },
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <p class="text-sm text-on-surface-variant">
      Strict mode: typing free text is allowed, but closing the dropdown without a match reverts the input to the last valid selection.
    </p>

    <Combobox.Root v-model="selected" strict>
      <Combobox.Activator class="flex items-center gap-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm">
        <Combobox.Input
          class="flex-1 bg-transparent outline-none text-on-surface placeholder:text-on-surface-variant"
          placeholder="Search countries…"
        />
        <Combobox.Cue class="text-xs opacity-50 cursor-pointer" />
      </Combobox.Activator>

      <Combobox.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
        <Combobox.Item
          v-for="item in countries"
          :id="item.id"
          :key="item.id"
          v-slot="{ isSelected }"
          class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
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
      Selected: {{ selected ?? 'None' }}
    </p>
  </div>
</template>
