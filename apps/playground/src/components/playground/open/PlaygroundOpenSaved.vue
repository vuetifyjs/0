<script setup lang="ts">
  // Components
  import AppSkeleton from '@/components/app/AppSkeleton.vue'

  // Local
  import { formatDate } from './types'

  // Types
  import type { VuetifyPlayground } from './types'

  const {
    items,
    loading = false,
    error,
    query = '',
    total = 0,
  } = defineProps<{
    items: VuetifyPlayground[]
    loading?: boolean
    error?: string
    query?: string
    /** Unfiltered count for empty vs no-match copy. */
    total?: number
  }>()

  const emit = defineEmits<{
    open: [item: VuetifyPlayground]
  }>()
</script>

<template>
  <div v-if="loading" class="p-4">
    <AppSkeleton height="h-12" :lines="4" />
  </div>

  <div
    v-else-if="error"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">{{ error }}</p>
  </div>

  <div
    v-else-if="total === 0"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">No saved playgrounds</p>
  </div>

  <div
    v-else-if="items.length === 0"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">No matches for “{{ query }}”</p>
  </div>

  <div v-else class="p-2">
    <button
      v-for="item in items"
      :key="item.id"
      class="w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left rounded-md hover:bg-surface-tint transition-colors"
      type="button"
      @click="emit('open', item)"
    >
      <span class="text-sm text-on-surface truncate">{{ item.title || 'Untitled' }}</span>

      <span class="text-xs text-on-surface-variant shrink-0">
        {{ formatDate(item.updatedAt || item.createdAt) }}
      </span>
    </button>
  </div>
</template>
