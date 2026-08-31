<script setup lang="ts">
  // Framework
  import { Button, createVirtual } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Context
  import PlaygroundOpenSavedRow from './PlaygroundOpenSavedRow.vue'

  // Utilities
  import { toRef } from 'vue'

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
    update: [item: VuetifyPlayground]
    remove: [id: string]
  }>()

  const ROW_HEIGHT = 48
  const virtual = createVirtual(toRef(() => items), {
    itemHeight: ROW_HEIGHT,
    overscan: 8,
  })
  const { element, items: virtualItems, offset, size, scroll } = virtual
</script>

<template>
  <div
    v-if="loading"
    class="p-4 h-full"
  >
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

  <div
    v-else
    class="h-full min-h-0 flex-1 flex flex-col"
  >
    <div
      v-if="pinned.length > 0"
      class="flex flex-wrap gap-1 px-3 pt-2 shrink-0"
    >
      <span
        v-for="item in pinned"
        :key="item.id"
        class="inline-flex items-center max-w-[11rem] h-6 rounded-full border border-divider bg-surface-tint/40"
      >
        <Button.Root
          class="min-w-0 inline-flex items-center gap-1 pl-1.5 pr-1 text-[11px] text-on-surface border-0 bg-transparent cursor-pointer"
          @click="emit('open', item)"
        >
          <AppIcon class="shrink-0 text-on-surface-variant" icon="pin" :size="12" />

          <span class="truncate">{{ item.title || 'Untitled' }}</span>
        </Button.Root>

        <AppTooltip
          as="span"
          class="inline-flex"
          :open-delay="200"
          position-area="top"
          text="Unpin"
        >
          <Button.Root
            aria-label="Unpin"
            class="shrink-0 p-0.5 mr-0.5 inline-flex items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint hover:text-on-surface cursor-pointer"
            @click.stop="emit('unpin', item)"
          >
            <AppIcon icon="close" :size="12" />
          </Button.Root>
        </AppTooltip>
      </span>
    </div>

    <div
      v-if="items.length === 0"
      class="p-8 text-center flex items-center justify-center"
      :class="pinned.length > 0 ? 'py-6' : 'h-full'"
    >
      <p class="text-sm text-on-surface-variant">
        {{ query ? `No matches for “${query}”` : 'No playgrounds' }}
      </p>
    </div>

    <div
      v-else
      ref="element"
      class="flex-1 min-h-0 overflow-y-auto p-2"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <PlaygroundOpenSavedRow
        v-for="entry in virtualItems"
        :key="entry.raw.id"
        :item="entry.raw"
        @open="emit('open', $event)"
        @remove="emit('remove', $event)"
        @update="emit('update', $event)"
      />

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>
