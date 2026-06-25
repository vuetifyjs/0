<script setup lang="ts">
  import type { ComboboxContext } from '@vuetify/v0'
  import type { Country } from './useCountrySearch'

  const { combobox, countries } = defineProps<{
    combobox: ComboboxContext
    countries: Country[]
  }>()

  function onInput (event: Event) {
    combobox.query.value = (event.target as HTMLInputElement).value
    combobox.pristine.value = false
    if (!combobox.isOpen.value) combobox.open()
  }

  function onKeydown (event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        if (!combobox.isOpen.value) combobox.open()
        combobox.cursor.next()
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        combobox.cursor.prev()
        break
      }
      case 'Enter': {
        event.preventDefault()
        const id = combobox.cursor.highlightedId.value
        if (id) combobox.select(id)
        break
      }
      case 'Escape': {
        combobox.close()
        break
      }
    }
  }
</script>

<template>
  <div class="relative">
    <input
      :id="combobox.inputId"
      :aria-activedescendant="combobox.cursor.highlightedId.value ? `${combobox.id}-option-${combobox.cursor.highlightedId.value}` : undefined"
      aria-autocomplete="both"
      :aria-controls="combobox.listboxId"
      :aria-expanded="combobox.isOpen.value"
      autocomplete="off"
      class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
      placeholder="Search countries…"
      role="combobox"
      :value="combobox.display.value"
      @focus="combobox.open()"
      @input="onInput"
      @keydown="onKeydown"
    >

    <div
      v-if="combobox.isOpen.value"
      :id="combobox.listboxId"
      class="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-divider bg-surface shadow-lg p-1"
      role="listbox"
    >
      <template v-for="country in countries" :key="country.id">
        <div
          v-if="combobox.filtered.value.has(country.id)"
          :id="`${combobox.id}-option-${country.id}`"
          :aria-selected="combobox.selection.selectedIds.has(country.id)"
          class="flex items-center justify-between px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface transition-colors"
          :class="{
            'bg-primary text-on-primary': combobox.cursor.highlightedId.value === country.id,
            'font-medium text-primary': combobox.selection.selectedIds.has(country.id) && combobox.cursor.highlightedId.value !== country.id,
          }"
          role="option"
          @click="combobox.select(country.id)"
          @pointerenter="combobox.cursor.highlight(country.id)"
        >
          <span>{{ country.value }}</span>
          <span class="text-xs opacity-60">{{ country.code }}</span>
        </div>
      </template>

      <div
        v-if="combobox.isEmpty.value"
        class="px-3 py-2 text-sm text-on-surface-variant"
      >
        No countries match "{{ combobox.query.value }}"
      </div>
    </div>
  </div>
</template>
