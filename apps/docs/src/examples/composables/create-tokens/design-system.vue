<script setup lang="ts">
  import { computed, shallowRef, toRef } from 'vue'
  import { CATEGORIES, tokens } from './tokens'
  import type { Category } from './tokens'

  const category = shallowRef<Category>('color')
  const search = shallowRef('')
  const resolveInput = shallowRef('{semantic.primary}')

  const resolved = toRef(() => {
    const input = resolveInput.value.trim()
    if (!input) return null
    const result = tokens.resolve(input)
    return result === undefined ? null : String(result)
  })

  const alias = toRef(() => tokens.isAlias(resolveInput.value.trim()))

  const categories = computed(() => {
    const all = tokens.values()
    const groups: Record<string, Array<{ id: string | number, value: unknown, resolved: unknown }>> = {
      color: [],
      semantic: [],
      spacing: [],
      radius: [],
    }

    for (const ticket of all) {
      const id = String(ticket.id)
      const prefix = id.split('.')[0]
      if (prefix in groups) {
        groups[prefix].push({
          id: ticket.id,
          value: ticket.value,
          resolved: tokens.resolve(String(ticket.value)) ?? ticket.value,
        })
      }
    }

    return groups
  })

  const filtered = computed(() => {
    const group = categories.value[category.value] ?? []
    if (!search.value) return group
    const q = search.value.toLowerCase()
    return group.filter(t => String(t.id).toLowerCase().includes(q) || String(t.value).toLowerCase().includes(q))
  })

  function isColor (value: unknown): boolean {
    return typeof value === 'string' && value.startsWith('#')
  }

  function onResolve (id: string) {
    resolveInput.value = `{${id}}`
  }
</script>

<template>
  <div class="space-y-5">
    <!-- Header stats -->
    <div class="flex items-center justify-between">
      <div class="text-xs text-on-surface-variant">
        {{ tokens.size }} tokens registered
      </div>
      <div class="flex gap-1">
        <button
          v-for="cat in CATEGORIES"
          :key="cat"
          class="px-2 py-0.5 text-xs rounded-md border capitalize transition-all"
          :class="category === cat
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-divider text-on-surface-variant hover:border-primary/50'"
          @click="category = cat"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Search -->
    <input
      v-model="search"
      class="w-full px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
      placeholder="Filter tokens..."
    >

    <!-- Token grid -->
    <div class="grid grid-cols-1 gap-1 max-h-56 overflow-auto pr-1">
      <button
        v-for="token in filtered"
        :key="String(token.id)"
        class="flex items-center gap-3 px-3 py-2 rounded-lg border border-divider hover:border-primary/30 transition-all text-left group"
        @click="onResolve(String(token.id))"
      >
        <!-- Color swatch or value indicator -->
        <div
          v-if="isColor(token.resolved)"
          class="size-6 rounded shrink-0 border border-divider"
          :style="{ backgroundColor: String(token.resolved) }"
        />
        <div
          v-else
          class="size-6 rounded shrink-0 bg-surface-variant flex items-center justify-center"
        >
          <span class="text-[10px] text-on-surface-variant font-mono">
            {{ String(token.resolved).slice(0, 3) }}
          </span>
        </div>

        <!-- Token info -->
        <div class="flex-1 min-w-0">
          <div class="text-xs font-mono text-on-surface truncate">{{ token.id }}</div>
          <div class="text-[10px] text-on-surface-variant/60 font-mono truncate">
            {{ tokens.isAlias(String(token.value)) ? `${token.value} → ${token.resolved}` : token.value }}
          </div>
        </div>

        <!-- Click hint -->
        <span class="text-on-surface-variant/40 opacity-0 group-hover:opacity-100 transition-opacity text-base">›</span>
      </button>

      <div
        v-if="filtered.length === 0"
        class="text-center text-sm text-on-surface-variant py-4"
      >
        No tokens matching "{{ search }}"
      </div>
    </div>

    <!-- Alias resolver -->
    <div class="rounded-lg border border-divider p-4 space-y-3">
      <div class="text-xs font-medium text-on-surface-variant">Alias Resolver</div>
      <div class="flex gap-2">
        <input
          v-model="resolveInput"
          class="flex-1 px-3 py-1.5 text-sm font-mono rounded-lg border border-divider bg-surface text-on-surface outline-none focus:border-primary"
          placeholder="{semantic.primary}"
        >
        <div
          v-if="resolved && isColor(resolved)"
          class="w-10 rounded-lg border border-divider shrink-0"
          :style="{ backgroundColor: resolved }"
        />
      </div>
      <div class="flex items-center gap-3 text-xs">
        <span
          v-if="alias"
          class="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium"
        >
          alias
        </span>
        <span
          v-else
          class="px-1.5 py-0.5 rounded bg-surface-variant text-on-surface-variant"
        >
          direct
        </span>
        <span class="font-mono text-on-surface">
          {{ resolved ?? 'unresolved' }}
        </span>
      </div>
    </div>
  </div>
</template>
