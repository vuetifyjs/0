<script setup lang="ts">
  import { createRegistry, useTypeahead } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import type { RegistryTicketInput } from '@vuetify/v0'

  const catalog = ['Alabama', 'Alaska', 'American Samoa', 'Arizona']

  const available = createRegistry<RegistryTicketInput<string>>({ reactive: true })

  available.onboard(catalog.map(name => ({ id: name, value: name })))

  const match = shallowRef('')

  const { typeahead } = useTypeahead(
    () => available.values(),
    { text: ticket => ticket.value ?? '' },
  )

  function toggle (name: string) {
    if (available.has(name)) {
      available.unregister(name)

      if (match.value === name) match.value = ''

      return
    }

    available.register({ id: name, value: name })
  }

  function onKeydown (event: KeyboardEvent) {
    if (event.key.length !== 1 || event.key === ' ') return
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return

    event.preventDefault()

    const result = typeahead(event.key)
    match.value = result?.item.value ?? ''
  }
</script>

<template>
  <div class="flex flex-col gap-3 max-w-sm">
    <button
      class="px-3 py-2 rounded border border-divider text-left"
      type="button"
      @keydown="onKeydown"
    >
      Focus and type a state
    </button>

    <p class="text-sm">
      Match: {{ match || 'none' }}
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="name in catalog"
        :key="name"
        :aria-pressed="available.has(name)"
        class="px-2 py-1 rounded border border-divider text-sm aria-pressed:bg-surface-variant"
        type="button"
        @click="toggle(name)"
      >
        {{ name }}
      </button>
    </div>

    <ul class="text-sm text-on-surface-variant">
      <li
        v-for="ticket in available.values()"
        :key="ticket.id"
      >
        {{ ticket.value }}
      </li>
    </ul>
  </div>
</template>
