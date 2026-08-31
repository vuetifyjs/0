<script setup lang="ts">
  // Framework
  import { Button, createFilter } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Context
  import PlaygroundDashboardRow from './PlaygroundDashboardRow.vue'

  // Composables
  import { useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Utilities
  import { computed, nextTick, shallowRef, toRef, useTemplateRef } from 'vue'
  import { RouterLink } from 'vue-router'

  // Types
  import type { OnePlayground } from '@/composables/useOnePlaygrounds'

  const {
    loading = false,
    error,
  } = defineProps<{
    loading?: boolean
    error?: string
  }>()

  const items = defineModel<OnePlayground[]>({ required: true })

  const one = useOnePlaygrounds()
  const query = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')
  const unpinning = shallowRef<string>()

  const filter = createFilter({
    keys: ['title', 'id'],
    mode: 'some',
  })

  const filterable = computed(() =>
    items.value.map(item => ({
      ...item,
      title: item.title || '',
    })),
  )

  const { items: filtered } = filter.apply(() => query.value, filterable)

  const pinned = computed(() => items.value.filter(item => item.pinned))
  const total = toRef(() => items.value.length)
  const showSearch = toRef(() => !loading && !error && total.value > 0)

  function onUpdate (next: OnePlayground) {
    items.value = items.value.map(entry => (
      entry.id === next.id ? { ...entry, ...next } : entry
    ))
  }

  function onRemove (id: string) {
    items.value = items.value.filter(entry => entry.id !== id)
  }

  async function onUnpin (item: OnePlayground) {
    if (unpinning.value) return
    unpinning.value = item.id
    const previous = { ...item }
    onUpdate({ ...item, pinned: false })
    try {
      const result = await one.patchMeta({ pinned: false }, item.id, item)
      onUpdate({ ...previous, ...result, pinned: false })
    } catch {
      onUpdate(previous)
    } finally {
      unpinning.value = undefined
    }
  }

  function onClearQuery () {
    query.value = ''
    nextTick(() => input.value?.focus())
  }
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      v-if="showSearch"
      class="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-divider bg-surface-tint/40 focus-within:border-primary/50 transition-colors"
    >
      <AppIcon class="shrink-0 text-on-surface-variant" icon="search" :size="16" />

      <input
        ref="input"
        v-model="query"
        class="flex-1 min-w-0 bg-transparent text-sm text-on-surface outline-none placeholder-on-surface-variant/50"
        placeholder="Filter Vuetify One…"
        type="search"
      >

      <AppCloseButton
        v-if="query"
        label="Clear search"
        size="sm"
        @click="onClearQuery"
      />
    </div>

    <div v-if="loading" class="p-4">
      <AppSkeleton height="h-12" :lines="4" />
    </div>

    <div
      v-else-if="error"
      class="p-8 text-center"
    >
      <p class="text-sm text-on-surface-variant">{{ error }}</p>
    </div>

    <div
      v-else-if="total === 0"
      class="p-8 text-center"
    >
      <p class="text-sm text-on-surface-variant">No Vuetify One playgrounds</p>

      <p class="text-xs text-on-surface-variant mt-1">
        Save from the editor via ☰ → File → Save
      </p>
    </div>

    <template v-else>
      <div
        v-if="pinned.length > 0"
        class="rounded-lg border border-divider bg-surface"
      >
        <div class="flex items-center gap-1.5 px-3 py-2 border-b border-divider text-xs text-on-surface-variant">
          <AppIcon icon="pin" :size="14" />
          <span>Pinned</span>
        </div>

        <div class="flex flex-wrap gap-2 p-3">
          <div
            v-for="item in pinned"
            :key="item.id"
            class="inline-flex items-center max-w-[16rem] h-8 rounded-md border border-divider bg-surface-tint/40"
          >
            <RouterLink
              class="min-w-0 inline-flex items-center gap-1.5 pl-2 pr-1 text-sm text-on-surface hover:text-primary"
              :to="`/playgrounds/${item.id}`"
            >
              <AppIcon class="shrink-0 text-on-surface-variant" icon="pin" :size="12" />
              <span class="truncate">{{ item.title || 'Untitled' }}</span>
            </RouterLink>

            <AppTooltip
              as="span"
              class="inline-flex"
              :open-delay="200"
              position-area="top"
              text="Unpin"
            >
              <Button.Root
                aria-label="Unpin"
                class="shrink-0 pa-1 me-0.5 inline-flex items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint hover:text-on-surface cursor-pointer data-[disabled]:opacity-40"
                :disabled="unpinning === item.id"
                @click.stop="onUnpin(item)"
              >
                <AppIcon icon="close" :size="12" />
              </Button.Root>
            </AppTooltip>
          </div>
        </div>
      </div>

      <div class="rounded-lg border border-divider bg-surface overflow-hidden">
        <div
          class="flex items-center justify-between gap-3 px-3 py-2 border-b border-divider text-[11px] text-on-surface-variant"
        >
          <span>Title</span>

          <span class="flex items-center gap-6">
            <span>Updated</span>

            <span>Actions</span>
          </span>
        </div>

        <div
          v-if="filtered.length === 0"
          class="p-8 text-center"
        >
          <p class="text-sm text-on-surface-variant">
            {{ query ? `No matches for “${query}”` : 'No playgrounds' }}
          </p>
        </div>

        <PlaygroundDashboardRow
          v-for="item in filtered"
          :key="item.id"
          :item
          @remove="onRemove"
          @update="onUpdate"
        />
      </div>
    </template>
  </div>
</template>
