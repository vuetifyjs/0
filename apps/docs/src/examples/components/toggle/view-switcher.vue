<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const view = shallowRef('grid')

  const items = [
    { title: 'Photos', count: 248 },
    { title: 'Documents', count: 53 },
    { title: 'Music', count: 112 },
    { title: 'Videos', count: 37 },
    { title: 'Archives', count: 19 },
    { title: 'Downloads', count: 84 },
  ]
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-on-surface-variant">{{ items.length }} folders</span>

      <Toggle.Group v-model="view" class="inline-flex rounded-lg border border-divider overflow-hidden" mandatory>
        <Toggle.Root
          class="p-2 transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="grid"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <rect
              height="7"
              rx="1"
              width="7"
              x="3"
              y="3"
            />

            <rect
              height="7"
              rx="1"
              width="7"
              x="14"
              y="3"
            />

            <rect
              height="7"
              rx="1"
              width="7"
              x="3"
              y="14"
            />

            <rect
              height="7"
              rx="1"
              width="7"
              x="14"
              y="14"
            />
          </svg>
        </Toggle.Root>

        <Toggle.Root
          class="p-2 border-l border-divider transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="list"
        >
          <svg
            class="size-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </Toggle.Root>
      </Toggle.Group>
    </div>

    <div
      :class="view === 'grid'
        ? 'grid grid-cols-3 gap-4'
        : 'flex flex-col gap-2'"
    >
      <div
        v-for="item in items"
        :key="item.title"
        :class="view === 'grid'
          ? 'flex flex-col items-center gap-2 p-4 rounded-lg border border-divider'
          : 'flex items-center justify-between px-4 py-3 rounded-lg border border-divider'"
      >
        <svg
          class="text-on-surface-variant"
          :class="view === 'grid' ? 'size-8' : 'size-5'"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>

        <div :class="view === 'grid' ? 'text-center' : 'flex-1 ml-3'">
          <div class="text-sm font-medium">{{ item.title }}</div>
          <div class="text-xs text-on-surface-variant">{{ item.count }} items</div>
        </div>
      </div>
    </div>
  </div>
</template>
