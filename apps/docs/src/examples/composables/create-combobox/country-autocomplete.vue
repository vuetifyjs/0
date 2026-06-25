<script setup lang="ts">
  import CountryAutocomplete from './CountryAutocomplete.vue'
  import { useCountrySearch } from './useCountrySearch'

  const { combobox, countries, selected } = useCountrySearch()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <CountryAutocomplete :combobox :countries />

    <div class="rounded-lg border border-divider bg-surface p-3">
      <p class="text-xs uppercase tracking-wide text-on-surface-variant mb-1">
        Selected country
      </p>

      <div v-if="selected" class="flex items-center justify-between">
        <span class="text-sm font-medium text-on-surface">{{ selected.value }}</span>
        <span class="text-xs text-on-surface-variant">{{ selected.code }} · {{ selected.region }}</span>
      </div>

      <p v-else class="text-sm text-on-surface-variant">
        None yet — start typing to search.
      </p>

      <button
        v-if="selected"
        class="mt-2 text-xs text-primary hover:underline"
        @click="combobox.clear()"
      >
        Clear selection
      </button>
    </div>
  </div>
</template>
