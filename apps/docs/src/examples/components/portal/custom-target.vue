<script setup lang="ts">
  import { Portal } from '@vuetify/v0'
  import { ref, shallowRef } from 'vue'

  const items = ref<string[]>([])
  const input = shallowRef('')

  function onAdd () {
    const value = input.value.trim()
    if (!value) return
    items.value.push(value)
    input.value = ''
  }

  function onRemove (index: number) {
    items.value.splice(index, 1)
  }
</script>

<template>
  <div class="grid grid-cols-2 gap-6">
    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        Input
      </h3>

      <form class="flex gap-2" @submit.prevent="onAdd">
        <input
          v-model="input"
          class="flex-1 rounded border border-divider bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
          placeholder="Add an item..."
        >

        <button
          class="rounded bg-primary px-3 py-2 text-sm text-on-primary disabled:opacity-50"
          :disabled="!input.trim()"
          type="submit"
        >
          Add
        </button>
      </form>

      <p class="text-xs text-on-surface-variant">
        Items are teleported into the target panel via Portal.
      </p>
    </div>

    <div class="flex flex-col gap-3">
      <h3 class="text-sm font-semibold uppercase tracking-wide text-on-surface-variant">
        Target
      </h3>

      <div
        id="custom-portal-target"
        class="min-h-32 rounded-lg border border-dashed border-divider p-3"
      >
        <p
          v-if="items.length === 0"
          class="m-0 flex h-full items-center justify-center text-sm text-on-surface-variant opacity-50"
        >
          No items yet
        </p>
      </div>
    </div>

    <Portal v-if="items.length > 0" to="#custom-portal-target">
      <ul class="m-0 flex list-none flex-col gap-2 p-0">
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex items-center justify-between rounded bg-surface-variant px-3 py-2"
        >
          <span class="text-sm">{{ item }}</span>

          <button
            class="text-xs text-on-surface-variant hover:text-error"
            @click="onRemove(index)"
          >
            remove
          </button>
        </li>
      </ul>
    </Portal>
  </div>
</template>
