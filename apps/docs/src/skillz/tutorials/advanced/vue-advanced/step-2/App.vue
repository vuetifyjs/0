<script setup>
  // Composables
  import { useList } from './useList'

  // Utilities
  import { ref, onUpdated } from 'vue'

  const input = ref('')
  const renderCount = ref(0)
  const { items, add, remove, clear } = useList(['Apple', 'Banana', 'Cherry'])

  onUpdated(() => {
    renderCount.value++
  })

  function addItem () {
    if (!input.value.trim()) return
    add(input.value.trim())
    input.value = ''
  }
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">
      shallowRef vs ref
    </h1>

    <div class="mb-4 p-3 rounded-lg bg-surface-tint text-sm">
      Render count: <strong class="text-primary">{{ renderCount }}</strong>
    </div>

    <div class="flex gap-2 mb-6">
      <input
        v-model="input"
        class="flex-1 px-3 py-2 rounded border border-solid border-divider bg-surface text-on-surface"
        placeholder="Add an item..."
        @keyup.enter="addItem"
      >

      <button
        class="px-4 py-2 rounded bg-primary text-on-primary font-medium"
        @click="addItem"
      >
        Add
      </button>

      <button
        class="px-4 py-2 rounded border border-solid border-divider text-on-surface-variant font-medium"
        @click="clear"
      >
        Clear
      </button>
    </div>

    <ul class="space-y-2">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center justify-between p-3 rounded-lg bg-surface"
      >
        <span class="text-on-surface">{{ item }}</span>

        <button
          class="text-sm text-error px-2 py-1 rounded hover:bg-surface-tint"
          @click="remove(index)"
        >
          Remove
        </button>
      </li>
    </ul>

    <p v-if="items.length === 0" class="text-on-surface-variant text-sm mt-4">
      List is empty. Add some items above.
    </p>
  </div>
</template>
