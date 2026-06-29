<script setup lang="ts">
  import { Form, NumberField } from '@vuetify/v0'
  import type { CartItem } from './useCart'

  const {
    items,
    subtotal,
    tax,
    total,
    lineSubtotal,
    checkout,
    reset,
  } = defineProps<{
    items: CartItem[]
    subtotal: number
    tax: number
    total: number
    lineSubtotal: (item: CartItem) => number
    checkout: (valid: boolean) => void
    reset: () => void
  }>()

  const currency: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }

  function money (value: number) {
    return value.toLocaleString('en-US', currency)
  }

  function onSubmit (payload: { valid: boolean }) {
    checkout(payload.valid)
  }
</script>

<template>
  <Form
    class="flex flex-col gap-4"
    @reset="reset"
    @submit="onSubmit"
  >
    <ul class="flex flex-col divide-y divide-divider rounded-lg border border-divider">
      <li
        v-for="item in items"
        :key="item.id"
        class="flex items-center gap-4 p-3"
      >
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-on-surface truncate">{{ item.name }}</p>

          <p class="text-xs text-on-surface-variant">
            {{ money(item.price) }} each &middot;
            <span :class="item.stock === 0 ? 'text-error' : ''">
              {{ item.stock === 0 ? 'Out of stock' : `${item.stock} in stock` }}
            </span>
          </p>
        </div>

        <NumberField.Root
          v-model="item.qty"
          clamp
          class="flex items-center"
          :disabled="item.stock === 0"
          :max="item.stock"
          :min="0"
          :name="`qty-${item.id}`"
          :step="1"
        >
          <NumberField.Decrement class="px-2 py-1 border border-divider rounded-l-lg text-on-surface hover:bg-surface-tint data-[disabled]:opacity-40">
            &minus;
          </NumberField.Decrement>

          <NumberField.Control class="w-12 text-center border-y border-divider py-1 outline-none bg-transparent text-on-surface tabular-nums data-[disabled]:opacity-40" />

          <NumberField.Increment class="px-2 py-1 border border-divider rounded-r-lg text-on-surface hover:bg-surface-tint data-[disabled]:opacity-40">
            +
          </NumberField.Increment>
        </NumberField.Root>

        <p class="w-20 text-right text-sm font-medium text-on-surface tabular-nums">
          {{ money(lineSubtotal(item)) }}
        </p>
      </li>
    </ul>

    <dl class="flex flex-col gap-1 text-sm">
      <div class="flex justify-between text-on-surface-variant">
        <dt>Subtotal</dt>
        <dd class="tabular-nums">{{ money(subtotal) }}</dd>
      </div>

      <div class="flex justify-between text-on-surface-variant">
        <dt>Tax (8.25%)</dt>
        <dd class="tabular-nums">{{ money(tax) }}</dd>
      </div>

      <div class="flex justify-between pt-1 border-t border-divider font-medium text-on-surface">
        <dt>Total</dt>
        <dd class="tabular-nums">{{ money(total) }}</dd>
      </div>
    </dl>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium disabled:opacity-50"
        :disabled="total === 0"
        type="submit"
      >
        Place order
      </button>

      <button
        class="px-4 py-2 rounded-lg border border-divider text-on-surface text-sm"
        type="reset"
      >
        Reset
      </button>
    </div>
  </Form>
</template>
