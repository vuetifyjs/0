<script setup lang="ts">
  import {
    mdiPackageVariantClosed,
    mdiPencilOutline,
    mdiRedo,
    mdiRefresh,
    mdiUndo,
  } from '@mdi/js'

  defineProps<{
    itemCount: number
    total: number
    low: number
    editedCount: number
    canRedo: boolean
    timelineSize: number
  }>()

  const emit = defineEmits<{
    undo: []
    redo: []
    clear: []
  }>()
</script>

<template>
  <div class="flex items-center justify-between flex-wrap gap-2">
    <div class="flex items-center gap-4 text-xs">
      <div class="flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5 text-on-surface-variant" viewBox="0 0 24 24">
          <path :d="mdiPackageVariantClosed" fill="currentColor" />
        </svg>

        <span class="text-on-surface-variant">Items</span>
        <span class="tabular-nums font-medium">{{ itemCount }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="text-on-surface-variant">Inventory value</span>
        <span class="tabular-nums font-medium">${{ total.toFixed(0) }}</span>
      </div>

      <div class="flex items-center gap-1.5">
        <span class="text-on-surface-variant">Low stock</span>

        <span
          class="tabular-nums font-medium px-1.5 rounded-full text-xs"
          :class="low > 0 ? 'bg-warning/15 text-warning' : 'text-on-surface-variant'"
        >
          {{ low }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div
        v-if="editedCount > 0"
        class="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24">
          <path :d="mdiPencilOutline" fill="currentColor" />
        </svg>

        <span class="tabular-nums">{{ editedCount }} edited</span>
      </div>

      <button
        class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="timelineSize === 0"
        title="Undo last edit (Ctrl+Z)"
        @click="emit('undo')"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24">
          <path :d="mdiUndo" fill="currentColor" />
        </svg>

        Undo
      </button>

      <button
        class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="!canRedo"
        title="Redo edit (Ctrl+Y)"
        @click="emit('redo')"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24">
          <path :d="mdiRedo" fill="currentColor" />
        </svg>

        Redo
      </button>

      <button
        class="flex items-center gap-1 px-2 py-1 text-xs border border-divider rounded hover:bg-surface-tint disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="timelineSize === 0"
        @click="emit('clear')"
      >
        <svg class="w-3 h-3" viewBox="0 0 24 24">
          <path :d="mdiRefresh" fill="currentColor" />
        </svg>

        Clear log
      </button>
    </div>
  </div>
</template>
