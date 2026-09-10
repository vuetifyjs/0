<script setup lang="ts">
  import type { Country } from './useCountrySearch'
  import { isElement, isUndefined, useClickOutside } from '@vuetify/v0'
  import { onBeforeUnmount, useTemplateRef, watch } from 'vue'
  import { useCountryCombobox } from './useCountrySearch'

  const { countries } = defineProps<{
    countries: Country[]
  }>()

  const combobox = useCountryCombobox()
  const input = useTemplateRef<HTMLInputElement>('input')
  const list = useTemplateRef<HTMLElement>('list')

  watch(input, el => {
    combobox.inputEl.value = el
  }, { immediate: true })

  combobox.popover.attach(() => list.value)

  useClickOutside(
    [input, list],
    () => {
      if (combobox.isOpen.value) {
        combobox.commit()
        combobox.close()
      }
    },
  )

  onBeforeUnmount(() => {
    combobox.inputEl.value = null
  })

  function onInput (event: Event) {
    combobox.query.value = (event.target as HTMLInputElement).value
    combobox.pristine.value = false
    if (!combobox.isOpen.value) combobox.open()
  }

  function composing (event: KeyboardEvent) {
    return event.isComposing && (
      event.key === 'ArrowUp'
      || event.key === 'ArrowDown'
      || event.key === 'ArrowLeft'
      || event.key === 'ArrowRight'
      || event.key === 'Enter'
      || event.key === 'Escape'
      || event.key === 'Tab'
      || event.key === ' '
    )
  }

  function onKeydown (event: KeyboardEvent) {
    if (composing(event)) return

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
        if (isUndefined(id)) combobox.commit()
        else combobox.select(id)
        break
      }
      case 'Tab': {
        const id = combobox.cursor.highlightedId.value
        if (isUndefined(id)) {
          combobox.commit()
        } else if (!combobox.selection.selected(id)) {
          combobox.select(id)
        }
        combobox.close()
        break
      }
      case 'Escape': {
        combobox.close()
        break
      }
    }
  }

  function bindEl (id: string, node: unknown) {
    const ticket = combobox.selection.get(id)
    if (isUndefined(ticket)) return
    ticket.el = node instanceof HTMLElement ? node : null
  }

  function onBlur (event: FocusEvent) {
    const next = event.relatedTarget
    if (isElement(next) && list.value?.contains(next)) return
    combobox.commit()
    combobox.close()
  }
</script>

<template>
  <div class="max-w-xs mx-auto">
    <input
      :id="combobox.inputId"
      ref="input"
      :aria-activedescendant="combobox.cursor.highlightedId.value ? `${combobox.id}-option-${combobox.cursor.highlightedId.value}` : undefined"
      aria-autocomplete="both"
      :aria-controls="combobox.listboxId"
      :aria-expanded="combobox.isOpen.value"
      autocomplete="off"
      class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-colors"
      placeholder="Search countries…"
      role="combobox"
      :style="combobox.popover.anchorStyles.value"
      :value="combobox.display.value"
      @blur="onBlur"
      @focus="combobox.open()"
      @input="onInput"
      @keydown="onKeydown"
    >

    <div
      :id="combobox.listboxId"
      ref="list"
      class="p-1 rounded-lg border border-divider bg-surface shadow-lg"
      popover="manual"
      role="listbox"
      :style="{ ...combobox.popover.contentStyles.value, minWidth: 'anchor-size(width)' }"
    >
      <template v-for="country in countries" :key="country.id">
        <div
          v-if="combobox.filtered.value.has(country.id)"
          :id="`${combobox.id}-option-${country.id}`"
          :ref="node => bindEl(country.id, node)"
          :aria-selected="combobox.selection.selected(country.id)"
          class="group flex items-center justify-between px-3 py-2 rounded-md cursor-default select-none text-sm text-on-surface hover:bg-surface-variant data-[selected]:font-medium data-[selected]:text-primary data-[highlighted]:bg-primary data-[highlighted]:text-on-primary data-[highlighted]:hover:bg-primary"
          :data-highlighted="combobox.cursor.highlightedId.value === country.id || undefined"
          :data-selected="combobox.selection.selected(country.id) || undefined"
          role="option"
          @click="combobox.select(country.id)"
          @pointerdown.prevent
          @pointerenter="combobox.cursor.highlight(country.id)"
        >
          <span>{{ country.value }}</span>
          <span class="text-xs text-on-surface-variant group-data-[highlighted]:text-on-primary group-data-[highlighted]:opacity-80">{{ country.code }}</span>
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
