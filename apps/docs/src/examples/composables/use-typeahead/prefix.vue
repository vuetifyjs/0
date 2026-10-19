<script setup lang="ts">
  import { useTypeahead } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import StateList from './StateList.vue'
  import { states } from './states'

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
      class="cursor-pointer rounded border border-divider px-3 py-2 text-left outline-none focus:border-primary focus:ring-2 focus:ring-primary"
      type="button"
      @keydown="onKeydown"
    >
      Focus and type a state
    </button>

    <p class="text-sm">
      Match: {{ match || 'none' }}
    </p>

    <StateList :match :states />
  </div>
</template>
