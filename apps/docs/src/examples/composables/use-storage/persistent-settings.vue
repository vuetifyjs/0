<script setup lang="ts">
  import { createStorageContext, MemoryAdapter, useStorage } from '@vuetify/v0'

  const [, provideStorage] = createStorageContext({
    adapter: new MemoryAdapter(),
    prefix: 'demo:',
  })

  provideStorage()

  const storage = useStorage()

  const count = storage.get('count', 0)
  const name = storage.get('name', 'Guest')
  const theme = storage.get('theme', 'light')
  const items = storage.get<string[]>('items', ['Item 1'])

  function onIncrement () {
    count.value++
  }

  function onDecrement () {
    count.value = Math.max(0, count.value - 1)
  }

  function onReset () {
    count.value = 0
    name.value = 'Guest'
    theme.value = 'light'
    items.value = ['Item 1']
  }

  function onAdd () {
    items.value = [...items.value, `Item ${items.value.length + 1}`]
  }

  function onRemove (index: number) {
    items.value = items.value.filter((_, i) => i !== index)
  }
</script>

<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-lg border border-divider p-3 space-y-2">
        <label class="block text-xs text-on-surface-variant">Name</label>
        <input
          v-model="name"
          class="w-full px-2 py-1.5 text-sm bg-surface border border-divider rounded-md text-on-surface outline-none focus:border-primary"
          placeholder="Your name"
        >
      </div>

      <div class="rounded-lg border border-divider p-3 space-y-2">
        <label class="block text-xs text-on-surface-variant">Theme</label>
        <div class="flex gap-1.5">
          <button
            v-for="t in ['light', 'dark', 'auto']"
            :key="t"
            class="flex-1 px-2 py-1.5 text-xs rounded-md border transition-all"
            :class="theme === t
              ? 'border-primary bg-primary/10 text-primary font-medium'
              : 'border-divider text-on-surface-variant hover:border-primary/50'"
            @click="theme = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </div>

    <div class="rounded-lg border border-divider p-3 space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs text-on-surface-variant">Counter</label>
        <span class="text-lg font-semibold text-on-surface tabular-nums">{{ count }}</span>
      </div>
      <div class="flex gap-1.5">
        <button
          class="flex-1 px-3 py-1.5 text-sm rounded-md border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
          @click="onDecrement"
        >
          -
        </button>
        <button
          class="flex-1 px-3 py-1.5 text-sm rounded-md border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
          @click="onIncrement"
        >
          +
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-divider p-3 space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-xs text-on-surface-variant">Items</label>
        <button
          class="text-xs text-primary hover:text-primary/80"
          @click="onAdd"
        >
          + Add
        </button>
      </div>
      <div class="space-y-1">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center justify-between px-2 py-1.5 rounded-md bg-surface-variant/30 text-sm"
        >
          <span class="text-on-surface">{{ item }}</span>
          <button
            class="text-xs text-on-surface-variant hover:text-error"
            @click="onRemove(index)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between rounded-lg border border-divider bg-surface-variant/30 p-3">
      <div class="text-xs space-y-0.5">
        <p class="text-on-surface-variant">
          Keys: count, name, theme, items
        </p>
        <p class="text-on-surface-variant">
          has("count"): <span class="font-mono text-on-surface">{{ storage.has('count') }}</span>
        </p>
      </div>
      <button
        class="px-3 py-1.5 text-xs rounded-md border border-divider text-on-surface-variant hover:border-error hover:text-error transition-colors"
        @click="onReset"
      >
        Reset all
      </button>
    </div>
  </div>
</template>
