<script setup lang="ts">
  import { useTypeahead } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import StateList from './StateList.vue'
  import { states } from './states'

  const match = shallowRef('')

  const { typeahead } = useTypeahead(() => states, {
    text: state => state.name,
  })

  function onKeydown (event: KeyboardEvent) {
    if (event.key.length !== 1 || event.key === ' ') return
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return

    event.preventDefault()

    const result = typeahead(event.key)
    match.value = result?.item.name ?? ''
  }
</script>

<template>
  <div
    aria-label="States"
    class="max-w-xs cursor-pointer overflow-hidden rounded-lg border border-divider bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary"
    tabindex="0"
    @keydown="onKeydown"
  >
    <div class="flex items-center justify-between border-b border-divider bg-surface-variant/40 px-3 py-2">
      <span class="text-sm font-medium">States</span>
      <span class="rounded border border-divider bg-surface px-1.5 py-0.5 font-mono text-xs text-on-surface-variant">type</span>
    </div>

    <StateList :match :states />

    <p class="border-t border-divider px-3 py-2 text-xs text-on-surface-variant">
      Match
      <span class="font-medium text-on-surface">{{ match || 'none' }}</span>
    </p>
  </div>
</template>
