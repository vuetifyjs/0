<script setup lang="ts">
  import CheckoutWizard from './CheckoutWizard.vue'
  import { useCheckout } from './useCheckout'

  const checkout = useCheckout()
</script>

<template>
  <div class="space-y-4 py-4">
    <CheckoutWizard :checkout />

    <p class="text-center text-xs text-on-surface-variant">
      Step {{ checkout.index.value + 1 }} of {{ checkout.wizard.size }} &middot;
      Gift wrap is unavailable and is skipped automatically &middot;
      {{ Math.round(checkout.progress.value) }}% complete
    </p>
  </div>
</template>
