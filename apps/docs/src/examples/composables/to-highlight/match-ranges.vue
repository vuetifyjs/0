<script setup lang="ts">
  import { toHighlight } from '@vuetify/v0'
  import type { MatchRange } from '@vuetify/v0'

  const text = 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.'

  // Pre-computed ranges: highlight every word that starts with a consonant cluster
  const matches: MatchRange[] = [
    [4, 9], // quick
    [10, 15], // brown
    [20, 25], // jumps
    [31, 35], // lazy
    [36, 39], // dog
    [41, 45], // Pack
    [49, 52], // box
    [58, 62], // five
    [63, 68], // dozen
  ]

  const chunks = toHighlight({ text, matches })
</script>

<template>
  <div class="flex flex-col gap-4 p-6 max-w-xl mx-auto">
    <p class="text-sm text-on-surface/60">
      Pre-computed <code>[start, end]</code> ranges — no query needed.
      Useful when matches come from a search engine or filter composable.
    </p>

    <p class="leading-relaxed text-on-surface">
      <template v-for="(chunk, i) in chunks" :key="i">
        <mark
          v-if="chunk.match"
          class="bg-success/30 text-on-surface rounded px-0.5 not-italic"
        >{{ chunk.text }}</mark>

        <template v-else>{{ chunk.text }}</template>
      </template>
    </p>

    <details class="text-xs text-on-surface/60">
      <summary class="cursor-pointer select-none font-medium">Show ranges</summary>
      <pre class="mt-2 p-2 rounded bg-surface border border-divider overflow-x-auto">{{ JSON.stringify(matches, null, 2) }}</pre>
    </details>
  </div>
</template>
