<script setup lang="ts">
  import { Form, Radio } from '@vuetify/v0'
  import type { ShippingMethod } from './useShipping'

  const {
    methods,
    submit,
    reset,
  } = defineProps<{
    methods: ShippingMethod[]
    submit: (valid: boolean) => void
    reset: () => void
  }>()

  const method = defineModel<string>('method', { default: 'standard' })

  function currency (value: number) {
    return value === 0 ? 'Free' : `$${value}`
  }

  function onSubmit (payload: { valid: boolean }) {
    submit(payload.valid)
  }
</script>

<template>
  <Form
    class="flex flex-col gap-4"
    @reset="reset"
    @submit="onSubmit"
  >
    <Radio.Group
      v-model="method"
      class="flex flex-col gap-2"
      label="Shipping method"
      mandatory
      name="shipping"
    >
      <label
        v-for="option in methods"
        :key="option.id"
        class="flex items-center gap-3 p-3 rounded-lg border border-divider bg-surface text-on-surface cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
      >
        <Radio.Root
          class="size-5 shrink-0 inline-flex items-center justify-center rounded-full border border-divider data-[state=checked]:border-primary data-[disabled]:opacity-50"
          :value="option.id"
        >
          <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
        </Radio.Root>

        <div class="flex-1">
          <div class="text-sm font-medium">{{ option.label }}</div>
          <div class="text-xs text-on-surface-variant">{{ option.eta }}</div>
        </div>

        <div class="text-sm font-medium" :class="option.price === 0 ? 'text-success' : 'text-on-surface'">
          {{ currency(option.price) }}
        </div>
      </label>
    </Radio.Group>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium"
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
