<script setup lang="ts">
  import { createCombobox } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

  const fruits = [
    { id: 'apple', value: 'Apple' },
    { id: 'banana', value: 'Banana' },
    { id: 'cherry', value: 'Cherry' },
    { id: 'date', value: 'Date' },
    { id: 'elderberry', value: 'Elderberry' },
    { id: 'fig', value: 'Fig' },
    { id: 'grape', value: 'Grape' },
  ]

  const combobox = createCombobox({ strict: true })

  for (const fruit of fruits) {
    combobox.selection.register(fruit)
  }

  const selectedLabel = toRef(() => {
    const id = combobox.selection.selectedIds.values().next().value
    if (!id) return 'None'
    const ticket = combobox.selection.get(id)
    return ticket ? String(ticket.value) : 'None'
  })

  function onInput (event: Event) {
    const value = (event.target as HTMLInputElement).value
    combobox.query.value = value
    combobox.pristine.value = false
    if (!combobox.isOpen.value) combobox.open()
  }

  function onKeydown (event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        if (!combobox.isOpen.value) {
          combobox.open()
        }
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
        if (combobox.cursor.highlightedId.value) {
          combobox.select(combobox.cursor.highlightedId.value)
        }
        break
      }
      case 'Escape': {
        combobox.close()
        break
      }
    }
  }

  const open = shallowRef(false)

  watch(combobox.isOpen, value => {
    open.value = value
  })
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <div class="relative">
      <input
        :id="combobox.inputId"
        aria-autocomplete="both"
        :aria-controls="combobox.listboxId"
        :aria-expanded="open"
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
        placeholder="Search fruits…"
        role="combobox"
        :value="combobox.display.value"
        @focus="combobox.open()"
        @input="onInput"
        @keydown="onKeydown"
      >
    </div>

    <div
      v-if="open"
      :id="combobox.listboxId"
      class="rounded-lg border border-divider bg-surface shadow-lg p-1"
      role="listbox"
    >
      <template v-for="fruit in fruits" :key="fruit.id">
        <div
          v-if="combobox.filtered.value.has(fruit.id)"
          :id="`${combobox.id}-option-${fruit.id}`"
          :aria-selected="combobox.selection.selectedIds.has(fruit.id)"
          class="px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface transition-colors"
          :class="{
            'bg-primary text-on-primary': combobox.cursor.highlightedId.value === fruit.id,
            'font-medium text-primary': combobox.selection.selectedIds.has(fruit.id) && combobox.cursor.highlightedId.value !== fruit.id,
          }"
          role="option"
          @click="combobox.select(fruit.id)"
          @pointerenter="combobox.cursor.highlight(fruit.id)"
        >
          {{ fruit.value }}
        </div>
      </template>

      <div
        v-if="combobox.isEmpty.value"
        class="px-3 py-2 text-sm text-on-surface-variant"
      >
        No results for "{{ combobox.query.value }}"
      </div>
    </div>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ selectedLabel }}
    </p>
  </div>
</template>
