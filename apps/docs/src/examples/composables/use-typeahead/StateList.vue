<script setup lang="ts">
  import type { State } from './states'

  const { states, match = '' } = defineProps<{
    states: readonly State[]
    match?: string
  }>()
</script>

<template>
  <ul role="listbox">
    <li
      v-for="state in states"
      :key="state.code"
      :aria-selected="state.name === match"
      class="flex items-center gap-3 border-l-2 border-transparent px-3 py-2 text-sm text-on-surface-variant data-[selected]:border-primary data-[selected]:bg-primary/10 data-[selected]:font-medium data-[selected]:text-on-surface"
      :data-selected="state.name === match || undefined"
      role="option"
    >
      <span class="w-8 font-mono text-xs">{{ state.code }}</span>
      <span>{{ state.name }}</span>
    </li>
  </ul>
</template>
