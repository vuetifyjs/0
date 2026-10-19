<script setup lang="ts">
  import { createSelection, useProxyModel, useProxyRegistry, useTypeahead } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'
  import FruitList from './FruitList.vue'
  import { fruits } from './fruits'

  import type { SelectionTicketInput } from '@vuetify/v0'

  const selection = createSelection<SelectionTicketInput<string>>({ events: true })
  const items = useProxyRegistry(selection)
  const selected = shallowRef<string | undefined>()

  selection.onboard(fruits.map(fruit => ({ id: fruit.name, value: fruit.name })))

  useProxyModel(selection, selected)

  const tint = toRef(() => fruits.find(fruit => fruit.name === selected.value)?.tint)

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
  <div class="flex max-w-lg flex-col gap-4">
    <div class="flex items-center gap-3 rounded-lg border border-divider bg-surface-variant/30 p-4">
      <span
        class="size-8 rounded-full border border-divider"
        :style="tint ? { backgroundColor: tint } : undefined"
      />

      <div>
        <p class="text-xs uppercase tracking-wider text-on-surface-variant">Selected</p>
        <p class="text-2xl font-medium">{{ selected || 'None' }}</p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-2 text-xs uppercase tracking-wider text-on-surface-variant">Catalog</p>

        <div class="flex flex-col gap-2">
          <button
            v-for="fruit in fruits"
            :key="fruit.name"
            :aria-pressed="items.keys.includes(fruit.name)"
            class="flex items-center gap-2 rounded-full border border-divider px-3 py-1.5 text-left text-sm aria-pressed:bg-surface-variant"
            type="button"
            @click="toggle(fruit.name)"
          >
            <span
              class="size-2.5 rounded-full"
              :style="{ backgroundColor: fruit.tint }"
            />
            {{ fruit.name }}
          </button>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-divider">
        <button
          class="w-full cursor-pointer border-b border-divider px-3 py-2 text-left text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
          type="button"
          @keydown="onKeydown"
        >
          Jump
        </button>

        <FruitList :tickets="items.values" />
      </div>
    </div>
  </div>
</template>
