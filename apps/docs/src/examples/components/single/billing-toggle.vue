<script setup lang="ts">
  import BillingToggle from './BillingToggle.vue'
  import { usePlanPricing } from './usePlanPricing'

  const { periods, period, price, billed, savings, isYearly } = usePlanPricing()
</script>

<template>
  <div class="max-w-sm mx-auto flex flex-col gap-5">
    <BillingToggle v-model:period="period" :periods />

    <div class="flex flex-col gap-1 p-5 rounded-xl border border-divider bg-surface text-on-surface text-center">
      <p class="text-sm font-medium text-on-surface-variant">Pro plan</p>

      <p class="flex items-baseline justify-center gap-1">
        <span class="text-4xl font-bold">${{ price }}</span>
        <span class="text-sm text-on-surface-variant">/ month</span>
      </p>

      <p class="text-sm text-on-surface-variant">{{ billed }}</p>

      <p
        v-if="isYearly"
        class="mt-2 self-center px-2.5 py-1 rounded-full text-xs font-medium bg-success/15 text-success"
      >
        You save {{ savings }}% with yearly billing
      </p>
    </div>
  </div>
</template>
