<script setup lang="ts">
  import { createCombobox, createVirtual, isUndefined } from '@vuetify/v0'
  import { computed, nextTick, useTemplateRef, watch } from 'vue'

  const HEIGHT = 36
  const combobox = createCombobox({ strict: true })
  const input = useTemplateRef<HTMLInputElement>('input')

  for (let index = 0; index < 2000; index++) {
    combobox.selection.register({
      id: `city-${index}`,
      value: `City ${String(index + 1).padStart(4, '0')}`,
    })
  }

  const rows = computed(() => {
    const ids = combobox.filtered.value
    return combobox.selection.values()
      .filter(ticket => ids.has(ticket.id))
      .map(ticket => ({
        id: String(ticket.id),
        label: String(ticket.value ?? ''),
      }))
  })

  const virtual = createVirtual(rows, { itemHeight: HEIGHT })
  const { element, items, offset, size, scroll, scrollTo } = virtual

  watch(input, el => {
    combobox.inputEl.value = el
  }, { immediate: true })

  watch(() => combobox.cursor.highlightedId.value, id => {
    if (isUndefined(id)) return
    const index = rows.value.findIndex(row => row.id === id)
    if (index === -1) return
    scrollTo(index, { block: 'nearest' })
    nextTick(() => combobox.cursor.highlight(id))
  })

  function bindEl (id: string, node: unknown) {
    const ticket = combobox.selection.get(id)
    if (isUndefined(ticket)) return
    ticket.el = node instanceof HTMLElement ? node : null
  }

  function onInput (event: Event) {
    combobox.query.value = (event.target as HTMLInputElement).value
    combobox.pristine.value = false
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.isComposing) return
    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
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
        if (!isUndefined(id)) combobox.select(id)

        break
      }
    // No default
    }
  }
</script>

<template>
  <div class="max-w-xs mx-auto flex flex-col gap-2">
    <input
      ref="input"
      :aria-activedescendant="combobox.cursor.highlightedId.value ? `${combobox.id}-option-${combobox.cursor.highlightedId.value}` : undefined"
      aria-autocomplete="both"
      :aria-controls="combobox.listboxId"
      aria-expanded="true"
      autocomplete="off"
      class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
      placeholder="Search 2,000 cities…"
      role="combobox"
      :value="combobox.display.value"
      @input="onInput"
      @keydown="onKeydown"
    >

    <div
      :id="combobox.listboxId"
      ref="element"
      class="h-[240px] overflow-y-auto p-1 rounded-lg border border-divider bg-surface"
      role="listbox"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <div
        v-for="item in items"
        :id="`${combobox.id}-option-${item.raw.id}`"
        :key="item.raw.id"
        :ref="node => bindEl(item.raw.id, node)"
        :aria-selected="combobox.selection.selected(item.raw.id)"
        class="flex items-center px-3 rounded-md cursor-default select-none text-sm text-on-surface hover:bg-surface-variant data-[selected]:font-medium data-[selected]:text-primary data-[highlighted]:bg-primary data-[highlighted]:text-on-primary"
        :data-highlighted="combobox.cursor.highlightedId.value === item.raw.id || undefined"
        :data-selected="combobox.selection.selected(item.raw.id) || undefined"
        role="option"
        :style="{ height: `${HEIGHT}px` }"
        @click="combobox.select(item.raw.id)"
        @pointerenter="combobox.cursor.highlight(item.raw.id)"
      >
        {{ item.raw.label }}
      </div>

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>
