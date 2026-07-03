<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import NumberStepper from './NumberStepper.vue'
  import { useOrder } from './useOrder'

  const { priceField, quantityField, total, reset } = useOrder()

  function onPrice (v: number) {
    priceField.value.value = v
    priceField.commit()
  }

  function onQuantity (v: number) {
    quantityField.value.value = v
    quantityField.commit()
  }
</script>

<template>
  <div class="max-w-md mx-auto flex flex-col gap-4 p-4 rounded-xl border border-divider bg-surface">
    <div class="flex flex-wrap items-end gap-4">
      <NumberStepper :commit="onPrice" :field="priceField" label="Unit price" />
      <NumberStepper :commit="onQuantity" :field="quantityField" label="Quantity" />
    </div>

    <div class="flex items-center justify-between border-t border-divider pt-3">
      <span class="text-sm text-on-surface-variant">Order total</span>
      <span class="text-lg font-semibold tabular-nums text-primary">{{ total }}</span>
    </div>

    <Button.Root
      class="self-start px-3 py-1 rounded-lg border border-divider text-sm text-on-surface"
      @click="reset"
    >
      Reset
    </Button.Root>
  </div>
</template>
