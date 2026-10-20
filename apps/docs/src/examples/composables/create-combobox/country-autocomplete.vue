<script setup lang="ts">
  import CountryAutocomplete from './CountryAutocomplete.vue'
  import { useCountrySearch } from './useCountrySearch'

  const { combobox, countries, selected, provideCountryCombobox } = useCountrySearch()

  provideCountryCombobox(combobox)
</script>

<template>
  <div class="flex flex-col gap-4 max-w-xs mx-auto">
    <CountryAutocomplete :countries />

    <div class="rounded-lg border border-divider bg-surface p-3">
      <p class="text-xs uppercase tracking-wide text-on-surface-variant mb-1">
        Selected country
      </p>

      <div class="grid min-h-10 items-center">
        <div
          class="col-start-1 row-start-1 flex items-center justify-between gap-2"
          :class="!selected && 'invisible'"
        >
          <span class="text-sm font-medium text-on-surface truncate">{{ selected?.value }}</span>
          <span class="text-xs text-on-surface-variant shrink-0">{{ selected?.code }} · {{ selected?.region }}</span>
        </div>

        <p
          class="col-start-1 row-start-1 text-sm text-on-surface-variant"
          :class="selected && 'invisible'"
        >
          None yet
        </p>
      </div>

      <hr class="my-2 border-0 border-t border-divider">

      <button
        class="text-xs text-primary hover:underline disabled:text-on-surface-variant disabled:hover:no-underline disabled:cursor-not-allowed"
        :disabled="!selected"
        @click="combobox.clear()"
      >
        Clear selection
      </button>
    </div>
  </div>
</template>
