<script setup lang="ts">
  import { Button } from '@vuetify/v0'

  import type { Checkout } from './useCheckout'

  const { checkout } = defineProps<{ checkout: Checkout }>()
</script>

<template>
  <div class="w-full max-w-2xl mx-auto space-y-8">
    <!-- Progress track -->
    <div class="relative flex items-center justify-between">
      <div class="absolute left-0 right-0 top-5 h-0.5 bg-divider" />

      <div
        class="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-500 ease-out"
        :style="{ width: `${checkout.progress.value}%` }"
      />

      <Button.Root
        v-for="(row, i) in checkout.rows.value"
        :key="row.id"
        class="relative z-10 flex flex-col items-center gap-3 disabled:cursor-not-allowed"
        :disabled="row.disabled"
        @click="checkout.wizard.select(row.id)"
      >
        <span
          class="size-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 border-transparent transition-all duration-300"
          :class="{
            'bg-primary text-on-primary scale-90': row.phase === 'done',
            'bg-primary text-on-primary ring-4 ring-primary/30 scale-110': row.phase === 'active',
            'bg-surface border-divider text-on-surface-variant': row.phase === 'todo',
            'bg-surface border-dashed border-divider text-on-surface-variant/50': row.phase === 'off',
          }"
        >
          <svg
            v-if="row.phase === 'done'"
            class="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" />
          </svg>

          <template v-else>{{ i + 1 }}</template>
        </span>

        <span
          class="text-xs font-medium transition-colors"
          :class="{
            'text-primary': row.phase === 'active',
            'line-through opacity-50': row.phase === 'off',
            'text-on-surface-variant': row.phase !== 'active' && row.phase !== 'off',
          }"
        >
          {{ row.label }}
        </span>
      </Button.Root>
    </div>

    <!-- Active step content -->
    <div
      v-if="checkout.current.value"
      class="rounded-xl border border-divider bg-surface p-6 text-center space-y-2"
    >
      <h3 class="text-lg font-semibold text-on-surface">{{ checkout.current.value.label }}</h3>
      <p class="text-sm text-on-surface-variant">{{ checkout.current.value.description }}</p>
    </div>

    <!-- Controls -->
    <div class="flex items-center justify-center gap-2">
      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg border border-divider transition-colors hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="checkout.isFirst.value"
        @click="checkout.wizard.first()"
      >
        First
      </Button.Root>

      <Button.Root
        class="px-4 py-1.5 text-sm rounded-lg bg-primary/10 text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="checkout.isFirst.value"
        @click="checkout.wizard.prev()"
      >
        Prev
      </Button.Root>

      <Button.Root
        class="px-4 py-1.5 text-sm rounded-lg bg-primary text-on-primary transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="checkout.isLast.value"
        @click="checkout.wizard.next()"
      >
        Next
      </Button.Root>

      <Button.Root
        class="px-3 py-1.5 text-sm rounded-lg border border-divider transition-colors hover:bg-surface-variant disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="checkout.isLast.value"
        @click="checkout.wizard.last()"
      >
        Last
      </Button.Root>
    </div>
  </div>
</template>
