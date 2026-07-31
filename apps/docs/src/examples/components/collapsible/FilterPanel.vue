<script setup lang="ts">
  import { Button, Checkbox, Collapsible, Radio } from '@vuetify/v0'
  import type { FilterOption, FilterValues } from './useFilterPanel'

  const {
    sections,
    priceRanges,
    brands,
    ratings,
    allOpen,
    anyOpen,
    expand,
    collapse,
  } = defineProps<{
    sections: FilterOption[]
    priceRanges: FilterOption[]
    brands: FilterOption[]
    ratings: FilterOption[]
    allOpen: boolean
    anyOpen: boolean
    expand: () => void
    collapse: () => void
  }>()

  const open = defineModel<Record<string, boolean>>('open', { required: true })
  const filters = defineModel<FilterValues>('filters', { required: true })
</script>

<template>
  <div class="border border-divider rounded-lg border-solid overflow-hidden bg-surface">
    <div class="flex items-center justify-between gap-2 px-3 py-2 border-b border-divider border-solid">
      <span class="text-sm font-semibold text-on-surface">Filters</span>

      <div class="flex items-center gap-1">
        <Button.Root
          class="px-2 py-1 text-xs rounded border border-divider text-on-surface-variant hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="allOpen"
          @click="expand"
        >
          Expand all
        </Button.Root>

        <Button.Root
          class="px-2 py-1 text-xs rounded border border-divider text-on-surface-variant hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!anyOpen"
          @click="collapse"
        >
          Collapse all
        </Button.Root>
      </div>
    </div>

    <Collapsible.Root
      v-for="section in sections"
      :key="section.id"
      v-model="open[section.id]"
      class="border-b border-divider border-solid last:border-b-0"
    >
      <Collapsible.Activator
        class="w-full px-3 py-2.5 border-none flex items-center gap-2 text-left cursor-pointer bg-surface hover:bg-surface-tint"
      >
        <span class="flex-1 text-sm font-medium text-on-surface">{{ section.label }}</span>

        <Collapsible.Cue class="size-4 shrink-0 text-on-surface-variant transition-transform duration-200 data-[state=open]:rotate-180">
          <svg
            class="size-full"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Collapsible.Cue>
      </Collapsible.Activator>

      <Collapsible.Content class="px-3 pb-3 pt-1">
        <Checkbox.Group
          v-if="section.id === 'price'"
          v-model="filters.prices"
          class="flex flex-col gap-1.5"
        >
          <label
            v-for="range in priceRanges"
            :key="range.id"
            class="flex items-center gap-2 text-sm text-on-surface cursor-pointer"
          >
            <Checkbox.Root
              class="size-4 shrink-0 inline-flex items-center justify-center rounded border border-divider data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              :value="range.id"
            >
              <Checkbox.Indicator class="text-on-primary">
                <svg
                  class="size-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>

            <span>{{ range.label }}</span>
          </label>
        </Checkbox.Group>

        <Checkbox.Group
          v-else-if="section.id === 'brand'"
          v-model="filters.brands"
          class="flex flex-col gap-1.5"
        >
          <label
            v-for="brand in brands"
            :key="brand.id"
            class="flex items-center gap-2 text-sm text-on-surface cursor-pointer"
          >
            <Checkbox.Root
              class="size-4 shrink-0 inline-flex items-center justify-center rounded border border-divider data-[state=checked]:border-primary data-[state=checked]:bg-primary"
              :value="brand.id"
            >
              <Checkbox.Indicator class="text-on-primary">
                <svg
                  class="size-3"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="3"
                  viewBox="0 0 24 24"
                >
                  <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </Checkbox.Indicator>
            </Checkbox.Root>

            <span>{{ brand.label }}</span>
          </label>
        </Checkbox.Group>

        <Radio.Group
          v-else
          v-model="filters.rating"
          class="flex flex-col gap-1.5"
        >
          <label
            v-for="rating in ratings"
            :key="rating.id"
            class="flex items-center gap-2 text-sm text-on-surface cursor-pointer"
          >
            <Radio.Root
              class="size-4 shrink-0 inline-flex items-center justify-center rounded-full border border-divider data-[state=checked]:border-primary"
              :value="rating.id"
            >
              <Radio.Indicator class="size-2 rounded-full bg-primary" />
            </Radio.Root>

            <span>{{ rating.label }}</span>
          </label>
        </Radio.Group>
      </Collapsible.Content>
    </Collapsible.Root>
  </div>
</template>
