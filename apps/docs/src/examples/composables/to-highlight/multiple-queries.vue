<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { toHighlight } from '@vuetify/v0'

  const input = shallowRef('Vue, reactive')
  const query = computed(() =>
    input.value.split(',').map(s => s.trim()).filter(Boolean),
  )

  const text = 'Vue 3 uses a reactive system built on ES Proxy. Reactive state is declared with ref and reactive, and tracked automatically inside computed and watch callbacks.'

  const chunks = toHighlight({ text, query })
</script>

<template>
  <div class="flex flex-col gap-4 p-6 max-w-xl mx-auto">
    <label class="flex flex-col gap-1 text-sm font-medium">
      Queries (comma-separated)
      <input
        v-model="input"
        class="px-3 py-2 rounded border border-divider bg-surface text-on-surface outline-none focus:ring-2 focus:ring-primary/40"
        placeholder="e.g. Vue, reactive"
        type="text"
      >
    </label>

    <div class="flex flex-wrap gap-1">
      <span
        v-for="term in query"
        :key="term"
        class="px-2 py-0.5 rounded-full bg-primary/15 text-on-surface text-xs font-medium"
      >{{ term }}</span>
    </div>

    <p class="leading-relaxed text-on-surface">
      <template v-for="(chunk, i) in chunks" :key="i">
        <mark
          v-if="chunk.match"
          class="bg-primary/25 text-on-surface rounded px-0.5 not-italic font-medium"
        >{{ chunk.text }}</mark>

        <template v-else>{{ chunk.text }}</template>
      </template>
    </p>
  </div>
</template>
