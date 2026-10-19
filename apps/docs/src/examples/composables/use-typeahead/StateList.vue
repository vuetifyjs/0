<script setup lang="ts">
  const { states, match = '' } = defineProps<{
    states: readonly string[]
    match?: string
  }>()
</script>

<template>
  <ul class="text-sm text-on-surface-variant">
    <li
      v-for="state in states"
      :key="state"
      class="data-[selected]:font-medium data-[selected]:text-on-surface"
      :data-selected="state === match || undefined"
    >
      {{ state }}
    </li>
  </ul>
</template>
