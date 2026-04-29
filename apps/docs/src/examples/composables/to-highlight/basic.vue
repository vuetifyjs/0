<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { toHighlight } from '@vuetify/v0'

  const query = shallowRef('lorem')
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'

  const chunks = toHighlight({ text, query })
</script>

<template>
  <div class="flex flex-col gap-4 p-6 max-w-xl mx-auto">
    <label class="flex flex-col gap-1 text-sm font-medium">
      Search
      <input
        v-model="query"
        class="px-3 py-2 rounded border border-divider bg-surface text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="Type to highlight…"
        type="text"
      >
    </label>

    <p class="leading-relaxed text-on-surface">
      <template v-for="(chunk, i) in chunks" :key="i">
        <mark
          v-if="chunk.match"
          class="bg-primary/25 text-on-surface rounded px-0.5 not-italic"
        >{{ chunk.text }}</mark>

        <template v-else>{{ chunk.text }}</template>
      </template>
    </p>
  </div>
</template>
