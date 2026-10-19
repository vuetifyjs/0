<script setup lang="ts">
  import { createSelection, useProxyModel, useProxyRegistry, useTypeahead } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import type { SelectionTicketInput } from '@vuetify/v0'

  const catalog = ['Alabama', 'Alaska', 'American Samoa', 'Arizona']

  const selection = createSelection<SelectionTicketInput<string>>({ events: true })
  const items = useProxyRegistry(selection)
  const selected = shallowRef<string | undefined>()

  selection.onboard(catalog.map(name => ({ id: name, value: name })))

  useProxyModel(selection, selected)

  const { typeahead } = useTypeahead(
    () => items.values,
    { text: ticket => ticket.value ?? '' },
  )

  function toggle (name: string) {
    if (selection.has(name)) {
      selection.unregister(name)
      return
    }

    selection.register({ id: name, value: name })
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key.length !== 1 || event.key === ' ') return
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return

    event.preventDefault()

    const result = typeahead(event.key)
    if (!result) return

    selection.select(result.item.id)
  }
</script>

<template>
  <div class="flex flex-col gap-3 max-w-sm">
    <button
      class="cursor-pointer rounded border border-divider px-3 py-2 text-left outline-none focus:border-primary focus:ring-2 focus:ring-primary"
      type="button"
      @keydown="onKeydown"
    >
      Focus and type a state
    </button>

    <p class="text-sm">
      Selected: {{ selected || 'none' }}
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="name in catalog"
        :key="name"
        :aria-pressed="items.keys.includes(name)"
        class="rounded border border-divider px-2 py-1 text-sm aria-pressed:bg-surface-variant"
        type="button"
        @click="toggle(name)"
      >
        {{ name }}
      </button>
    </div>

    <ul class="text-sm text-on-surface-variant">
      <li
        v-for="ticket in items.values"
        :key="ticket.id"
        class="data-[selected]:font-medium data-[selected]:text-on-surface"
        :data-selected="ticket.isSelected.value || undefined"
      >
        {{ ticket.value }}
      </li>
    </ul>
  </div>
</template>
