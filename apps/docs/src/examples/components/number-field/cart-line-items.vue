<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import CartLineItems from './CartLineItems.vue'
  import { useCart } from './useCart'

  const {
    items,
    placed,
    subtotal,
    tax,
    total,
    count,
    lineSubtotal,
    checkout,
    reset,
  } = useCart()

  function money (value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }
</script>

<template>
  <div class="max-w-md mx-auto">
    <div v-if="placed" class="flex flex-col gap-2 p-4 rounded-lg bg-surface-variant text-on-surface">
      <p class="text-sm font-medium text-success">Order placed</p>

      <ul class="flex flex-col gap-1 text-sm">
        <li
          v-for="line in placed.lines"
          :key="line.name"
          class="flex justify-between"
        >
          <span>{{ line.qty }} &times; {{ line.name }}</span>
          <span class="tabular-nums">{{ money(line.subtotal) }}</span>
        </li>
      </ul>

      <p class="pt-2 border-t border-divider text-sm font-medium flex justify-between">
        <span>Total charged</span>
        <span class="tabular-nums">{{ money(placed.total) }}</span>
      </p>

      <Button.Root
        class="self-start mt-2 px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Start a new order
      </Button.Root>
    </div>

    <CartLineItems
      v-else
      :checkout
      :items
      :line-subtotal
      :reset
      :subtotal
      :tax
      :total
    />

    <p class="mt-3 text-xs text-on-surface-variant">
      {{ count }} item{{ count === 1 ? '' : 's' }} in cart. Each quantity clamps to its line's
      stock — the out-of-stock cap is disabled at zero.
    </p>
  </div>
</template>
