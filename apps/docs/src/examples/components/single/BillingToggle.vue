<script setup lang="ts">
  import { Single } from '@vuetify/v0'
  import { toRef } from 'vue'
  import type { BillingPeriod } from './usePlanPricing'

  const { periods } = defineProps<{
    periods: BillingPeriod[]
  }>()

  const period = defineModel<string>('period', { default: 'monthly' })

  const index = toRef(() => periods.findIndex(p => p.id === period.value))
</script>

<template>
  <Single.Root v-model="period" mandatory>
    <div class="relative grid grid-cols-2 p-1 rounded-lg bg-surface-variant text-sm">
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-md bg-surface shadow-sm transition-transform duration-200 ease-out"
        :style="{ transform: `translateX(${index * 100}%)` }"
      />

      <Single.Item
        v-for="option in periods"
        :key="option.id"
        v-slot="{ attrs }"
        :value="option.id"
      >
        <button
          v-bind="attrs"
          class="relative z-10 flex items-center justify-center gap-2 px-4 py-1.5 rounded-md font-medium cursor-pointer text-on-surface-variant data-[selected]:text-on-surface"
          type="button"
        >
          {{ option.label }}

          <span
            v-if="option.note"
            class="px-1.5 py-0.5 rounded text-xs font-medium bg-success/15 text-success"
          >
            {{ option.note }}
          </span>
        </button>
      </Single.Item>
    </div>
  </Single.Root>
</template>
