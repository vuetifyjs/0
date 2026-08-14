<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'

  // Local
  import { formatDate } from './types'

  // Types
  import type { VuetifyPlayground } from './types'

  const {
    items,
    pinned = [],
    loading = false,
    error,
    query = '',
    total = 0,
  } = defineProps<{
    items: VuetifyPlayground[]
    /** Always-visible pinned pills, independent of chip/search. */
    pinned?: VuetifyPlayground[]
    loading?: boolean
    error?: string
    query?: string
    /** Unfiltered count for empty vs no-match copy. */
    total?: number
  }>()

  const emit = defineEmits<{
    open: [item: VuetifyPlayground]
    unpin: [item: VuetifyPlayground]
  }>()

  function visibilityIcon (item: VuetifyPlayground) {
    return item.visibility === 'private' ? 'visibility-private' : 'visibility-public'
  }

  function visibilityLabel (item: VuetifyPlayground) {
    return item.visibility === 'private' ? 'Private' : 'Public'
  }
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
    <p class="text-sm text-on-surface-variant">No Vuetify One playgrounds</p>
  </div>

  <div v-else>
    <div
      v-if="pinned.length"
      class="flex flex-wrap gap-1 px-3 pt-2"
    >
      <span
        v-for="item in pinned"
        :key="item.id"
        class="inline-flex items-center max-w-[11rem] h-6 rounded-full border border-divider bg-surface-tint/40"
      >
        <button
          class="min-w-0 inline-flex items-center gap-1 pl-1.5 pr-1 text-[11px] text-on-surface"
          type="button"
          @click="emit('open', item)"
        >
          <AppIcon class="shrink-0 text-on-surface-variant" icon="pin" :size="12" />
          <span class="truncate">{{ item.title || 'Untitled' }}</span>
        </button>

        <button
          aria-label="Unpin"
          class="shrink-0 p-0.5 mr-0.5 rounded-full text-on-surface-variant hover:bg-surface-tint hover:text-on-surface"
          type="button"
          @click="emit('unpin', item)"
        >
          <AppIcon icon="close" :size="12" />
        </button>
      </span>
    </div>

    <div
      v-if="items.length === 0"
      class="p-8 text-center flex items-center justify-center"
      :class="pinned.length ? 'py-6' : 'h-full'"
    >
      <p class="text-sm text-on-surface-variant">
        {{ query ? `No matches for “${query}”` : 'No playgrounds' }}
      </p>
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

        <span class="flex items-center gap-2 shrink-0">
          <span
            class="inline-flex items-center gap-1 text-on-surface-variant"
            :aria-label="[
              visibilityLabel(item),
              item.favorite ? 'Favorite' : null,
              item.locked ? 'Locked' : null,
            ].filter(Boolean).join(', ')"
          >
            <AppIcon
              v-if="item.favorite"
              icon="star"
              :size="14"
            />
            <AppIcon
              v-if="item.locked"
              icon="lock"
              :size="14"
            />
            <AppIcon
              :icon="visibilityIcon(item)"
              :size="14"
            />
          </span>

          <span class="text-xs text-on-surface-variant">
            {{ formatDate(item.updatedAt || item.createdAt) }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>
