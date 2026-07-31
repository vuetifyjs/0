<script setup lang="ts">
  import { Button, Input } from '@vuetify/v0'
  import { toRef } from 'vue'
  import type { MatchMode, Product } from './useProductFilter'

  const { results, allCategories, total, clear } = defineProps<{
    results: Product[]
    allCategories: string[]
    total: number
    clear: () => void
  }>()

  const query = defineModel<string>('query', { default: '' })
  const mode = defineModel<MatchMode>('mode', { default: 'union' })
  const categories = defineModel<string[]>('categories', { default: () => [] })

  const count = toRef(() => results.length)
  const active = toRef(() => !!query.value || categories.value.length > 0)

  const modes: { value: MatchMode, label: string }[] = [
    { value: 'union', label: 'Any word' },
    { value: 'intersection', label: 'All words' },
  ]

  function toggle (category: string) {
    categories.value = categories.value.includes(category)
      ? categories.value.filter(value => value !== category)
      : [...categories.value, category]
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <Input.Root v-model="query" class="flex flex-col gap-1" type="search">
      <Input.Control
        autocomplete="off"
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant/50 outline-none data-[focused]:border-primary transition-colors"
        placeholder="Search products..."
      />
    </Input.Root>

    <div class="flex items-center gap-2 text-sm">
      <span class="text-on-surface-variant">Match</span>

      <div class="flex rounded-lg border border-divider overflow-hidden">
        <Button.Root
          v-for="option in modes"
          :key="option.value"
          class="px-3 py-1 transition-colors"
          :class="mode === option.value
            ? 'bg-primary text-on-primary'
            : 'bg-surface text-on-surface-variant hover:bg-surface-variant'"
          @click="mode = option.value"
        >
          {{ option.label }}
        </Button.Root>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <Button.Root
        v-for="category in allCategories"
        :key="category"
        class="px-3 py-1 rounded-full border text-sm transition-colors"
        :class="categories.includes(category)
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-divider text-on-surface-variant hover:bg-surface-variant'"
        @click="toggle(category)"
      >
        {{ category }}
      </Button.Root>
    </div>

    <div class="flex items-center justify-between text-sm text-on-surface-variant">
      <span>{{ count }} of {{ total }} products</span>

      <Button.Root
        v-if="active"
        class="text-primary hover:underline"
        @click="clear"
      >
        Clear filters
      </Button.Root>
    </div>

    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <div
        v-for="product in results"
        :key="product.id"
        class="flex items-center justify-between gap-4 px-4 py-3 hover:bg-surface-tint transition-colors"
      >
        <div class="min-w-0">
          <p class="font-medium text-on-surface truncate">{{ product.name }}</p>
          <p class="text-sm text-on-surface-variant truncate">{{ product.description }}</p>
        </div>

        <div class="flex flex-col items-end shrink-0">
          <span class="text-sm font-mono text-on-surface">${{ product.price }}</span>
          <span class="text-xs text-on-surface-variant">{{ product.category }}</span>
        </div>
      </div>

      <div v-if="count === 0" class="px-4 py-8 text-center text-on-surface-variant">
        No products match your filters
      </div>
    </div>
  </div>
</template>
