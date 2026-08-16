<script setup lang="ts">
  import { Input, Single, toHighlight } from '@vuetify/v0'
  import { computed, shallowRef } from 'vue'
  import type { IgnoreAccents } from '@vuetify/v0'

  const query = shallowRef('zurich')
  const mode = shallowRef<'off' | 'target' | 'query' | 'both'>('target')

  const hints = {
    off: 'The query must match the exact characters.',
    target: 'Accents in the text are folded — type “zurich” or “krakow”.',
    query: 'Accents in the query are folded — copy “Trø” to match plain text.',
    both: 'Either side may carry accents.',
  }

  const ignoreAccents = computed<IgnoreAccents>(() => {
    if (mode.value === 'off') return false
    if (mode.value === 'both') return true

    return mode.value
  })

  const cities = [
    'São Paulo',
    'Zürich',
    'Kraków',
    'Málaga',
    'Bogotá',
    'Tromsø',
    'Montreal',
    'Reykjavík',
  ]

  const rows = computed(() => cities.map(city => ({
    city,
    chunks: toHighlight(city, query, { ignoreCase: true, matchAll: true, ignoreAccents }),
  })))
</script>

<template>
  <div class="flex flex-col gap-3 p-4 max-w-md mx-auto">
    <Input.Root id="accent-search" v-model="query" label="Search cities">
      <Input.Control
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface/40 outline-none data-[focused]:border-primary transition-colors"
        placeholder="Type an unaccented query…"
      />
    </Input.Root>

    <Single.Root v-model="mode" mandatory>
      <div class="flex flex-wrap gap-2">
        <Single.Item
          v-for="value in (['off', 'target', 'query', 'both'] as const)"
          :key="value"
          v-slot="{ attrs }"
          :value
        >
          <button
            v-bind="attrs"
            class="px-2.5 py-1 rounded-full border border-divider text-xs font-medium text-on-surface/70 transition-colors data-[selected]:border-primary data-[selected]:bg-primary/15 data-[selected]:text-on-surface"
          >
            {{ value }}
          </button>
        </Single.Item>
      </div>
    </Single.Root>

    <p class="text-xs text-on-surface/60">{{ hints[mode] }}</p>

    <ul class="flex flex-col rounded-lg border border-divider bg-surface divide-y divide-divider">
      <li v-for="row in rows" :key="row.city" class="px-3 py-2 text-sm">
        <template v-for="(chunk, index) in row.chunks" :key="index">
          <mark v-if="chunk.match" class="rounded-sm bg-primary/25 px-0.5 text-on-surface">{{ chunk.text }}</mark>
          <template v-else>{{ chunk.text }}</template>
        </template>
      </li>
    </ul>
  </div>
</template>
