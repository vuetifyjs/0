<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import FilterPanel from './FilterPanel.vue'
  import { useFilterPanel } from './useFilterPanel'

  const {
    sections,
    priceRanges,
    brands,
    ratings,
    open,
    filters,
    allOpen,
    anyOpen,
    active,
    chips,
    expand,
    collapse,
    clear,
  } = useFilterPanel()
</script>

<template>
  <div class="max-w-xs flex flex-col gap-3">
    <FilterPanel
      v-model:filters="filters"
      v-model:open="open"
      :all-open
      :any-open
      :brands
      :collapse
      :expand
      :price-ranges
      :ratings
      :sections
    />

    <div class="flex flex-col gap-2 p-3 rounded-lg border border-divider border-solid bg-surface text-sm">
      <div class="flex items-center justify-between gap-2">
        <span class="font-medium text-on-surface">
          {{ active }} active {{ active === 1 ? 'filter' : 'filters' }}
        </span>

        <Button.Root
          v-if="active"
          class="text-xs text-primary hover:underline border-none bg-transparent cursor-pointer"
          @click="clear"
        >
          Clear all
        </Button.Root>
      </div>

      <div v-if="chips.length > 0" class="flex flex-wrap gap-1.5">
        <span
          v-for="chip in chips"
          :key="chip.key"
          class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
        >
          {{ chip.label }}
        </span>
      </div>

      <p v-else class="text-on-surface-variant text-xs">
        No filters applied — showing all products.
      </p>
    </div>
  </div>
</template>
