<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import ShippingOptions from './ShippingOptions.vue'
  import { useShipping } from './useShipping'

  const { subtotal, methods, method, submitted, selected, shipping, total, onSubmit, reset } = useShipping()
</script>

<template>
  <div class="max-w-md mx-auto flex flex-col gap-4">
    <div v-if="submitted" class="flex flex-col gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium">Order placed</p>
      <p class="text-sm">Shipping via {{ submitted.method }} ({{ submitted.shipping === 0 ? 'Free' : `$${submitted.shipping}` }})</p>
      <p class="text-sm text-on-surface-variant">Total charged: ${{ submitted.total }}</p>

      <Button.Root
        class="self-start mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Start over
      </Button.Root>
    </div>

    <template v-else>
      <ShippingOptions
        v-model:method="method"
        :methods
        :reset
        :submit="onSubmit"
      />

      <dl class="flex flex-col gap-1 p-4 rounded-lg border border-divider bg-surface text-sm">
        <div class="flex justify-between text-on-surface-variant">
          <dt>Subtotal</dt>
          <dd>${{ subtotal }}</dd>
        </div>

        <div class="flex justify-between text-on-surface-variant">
          <dt>Shipping ({{ selected?.label }})</dt>
          <dd>{{ shipping === 0 ? 'Free' : `$${shipping}` }}</dd>
        </div>

        <div class="flex justify-between mt-1 pt-2 border-t border-divider font-medium text-on-surface">
          <dt>Total</dt>
          <dd>${{ total }}</dd>
        </div>
      </dl>
    </template>
  </div>
</template>
