<script setup lang="ts">
  import { useFilter } from '@vuetify/v0'
  import { computed, shallowRef } from 'vue'

  const cities = [
    { name: 'New York', country: 'USA', population: '8.3M' },
    { name: 'Los Angeles', country: 'USA', population: '3.9M' },
    { name: 'London', country: 'UK', population: '8.8M' },
    { name: 'Paris', country: 'France', population: '2.2M' },
    { name: 'Tokyo', country: 'Japan', population: '13.9M' },
    { name: 'Sydney', country: 'Australia', population: '5.3M' },
    { name: 'Toronto', country: 'Canada', population: '2.9M' },
    { name: 'Berlin', country: 'Germany', population: '3.6M' },
    { name: 'Singapore', country: 'Singapore', population: '5.5M' },
    { name: 'Dubai', country: 'UAE', population: '3.5M' },
    { name: 'San Francisco', country: 'USA', population: '870K' },
    { name: 'Amsterdam', country: 'Netherlands', population: '870K' },
  ]

  const query = shallowRef('')
  const { items } = useFilter(query, cities, { keys: ['name', 'country'] })

  function highlight (text: string) {
    if (!query.value) return text
    const regex = new RegExp(`(${query.value})`, 'gi')
    return text.replace(regex, '<mark class="bg-warning text-on-warning rounded px-0.5">$1</mark>')
  }

  const hasResults = computed(() => items.value.length > 0)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="relative">
      <input
        v-model="query"
        class="w-full px-4 py-3 pl-10 border border-divider bg-surface text-on-surface rounded-lg focus:border-primary focus:outline-none transition-colors"
        placeholder="Search cities or countries..."
        type="text"
      >
      <svg
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
      </svg>
    </div>

    <div class="flex items-center justify-between text-sm opacity-60">
      <span>{{ items.length }} of {{ cities.length }} results</span>
      <span v-if="query" class="font-mono text-xs">{{ `"${query}"` }}</span>
    </div>

    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <div
        v-for="city in items"
        :key="city.name"
        class="px-4 py-3 flex items-center justify-between hover:bg-surface-tint transition-colors"
      >
        <div>
          <span class="font-medium" v-html="highlight(city.name)" />
          <span class="mx-2 opacity-30">/</span>
          <span class="text-sm opacity-70" v-html="highlight(city.country)" />
        </div>
        <span class="text-sm font-mono opacity-50">{{ city.population }}</span>
      </div>

      <div
        v-if="!hasResults"
        class="px-4 py-8 text-center opacity-50"
      >
        No cities found matching "{{ query }}"
      </div>
    </div>
  </div>
</template>
