<script setup lang="ts">
  import { useTypeahead } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona']
  const match = shallowRef('')

  const { typeahead } = useTypeahead(() => states, {
    text: state => state,
  })

  function onKeydown (event: KeyboardEvent) {
    if (event.key.length !== 1 || event.key === ' ') return
    if (event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return

    event.preventDefault()

    const result = typeahead(event.key)
    match.value = result?.item ?? ''
  }
</script>

<template>
  <div class="flex flex-col gap-3 max-w-80">
    <button
      class="px-3 py-2 rounded border border-divider text-left outline-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary"
      type="button"
      @keydown="onKeydown"
    >
      Focus and type a state
    </button>

    <p class="text-sm">
      Match: {{ match || 'none' }}
    </p>

    <ul class="text-sm text-on-surface-variant">
      <li
        v-for="state in states"
        :key="state"
      >
        {{ state }}
      </li>
    </ul>
  </div>
</template>
