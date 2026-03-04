<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
  import { mdiPin, mdiPinOutline } from '@mdi/js'
  import { Checkbox, useProxyRegistry } from '@vuetify/v0'
  import { useBookmarks } from './context'

  import type { BookmarkTicket } from './context'

  const bookmarks = useBookmarks()
  const proxy = useProxyRegistry<BookmarkTicket>(bookmarks)

  const title = shallowRef('')
  const url = shallowRef('')
  const tags = shallowRef('')
  const filter = shallowRef<string | null>(null)

  const allTags = computed(() => {
    const set = new Set<string>()
    for (const ticket of proxy.values) {
      for (const tag of ticket.tags) {
        set.add(tag)
      }
    }
    return Array.from(set).toSorted()
  })

  const filtered = computed(() => {
    if (!filter.value) return proxy.values
    return proxy.values.filter(t => t.tags.includes(filter.value!))
  })

  function onAdd () {
    const t = title.value.trim()
    const u = url.value.trim()
    if (!t || !u) return
    bookmarks.add(t, u, tags.value.split(',').map(s => s.trim()).filter(Boolean))
    title.value = ''
    url.value = ''
    tags.value = ''
  }

  function onSelectAll () {
    for (const ticket of filtered.value) {
      if (!ticket.disabled) bookmarks.select(ticket.id)
    }
  }

  function onUnselectAll () {
    for (const ticket of filtered.value) {
      bookmarks.unselect(ticket.id)
    }
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Stats -->
    <div class="flex items-center gap-4 text-xs text-on-surface-variant">
      <span>{{ bookmarks.stats.value.total }} bookmarks</span>
      <span class="text-primary">{{ bookmarks.stats.value.selected }} selected</span>
      <span v-if="bookmarks.stats.value.pinned > 0" class="text-warning">{{ bookmarks.stats.value.pinned }} pinned</span>
    </div>

    <!-- Pinned bookmarks -->
    <div v-if="bookmarks.pinnedIds.size > 0" class="flex gap-2 flex-wrap">
      <span
        v-for="id in bookmarks.pinnedIds"
        :key="id"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-warning/10 text-warning"
      >
        <svg class="size-3" viewBox="0 0 24 24"><path :d="mdiPin" fill="currentColor" /></svg>
        {{ bookmarks.get(id)?.value }}
      </span>
    </div>

    <!-- Add bookmark -->
    <div class="flex gap-2 flex-wrap">
      <input
        v-model="title"
        class="flex-1 min-w-30 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="Title"
      >
      <input
        v-model="url"
        class="flex-1 min-w-30 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="https://..."
      >
      <input
        v-model="tags"
        class="flex-1 min-w-30 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="Tags (comma-separated)"
        @keydown.enter="onAdd"
      >
      <button
        class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 transition-colors"
        :disabled="!title.trim() || !url.trim()"
        @click="onAdd"
      >
        Add
      </button>
    </div>

    <!-- Filters + bulk actions -->
    <div class="flex items-center gap-1.5 flex-wrap">
      <button
        class="px-2 py-0.5 text-xs rounded-md border transition-all"
        :class="filter === null
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="filter = null"
      >
        All
      </button>
      <button
        v-for="tag in allTags"
        :key="tag"
        class="px-2 py-0.5 text-xs rounded-md border transition-all"
        :class="filter === tag
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="filter = filter === tag ? null : tag"
      >
        {{ tag }}
      </button>
      <span class="flex-1" />
      <button
        class="text-xs text-on-surface-variant hover:text-primary transition-colors"
        @click="onSelectAll"
      >
        Select all
      </button>
      <span class="text-on-surface-variant/30">|</span>
      <button
        class="text-xs text-on-surface-variant hover:text-primary transition-colors"
        @click="onUnselectAll"
      >
        Clear
      </button>
    </div>

    <!-- Bookmark list -->
    <div class="space-y-1">
      <div
        v-for="ticket in filtered"
        :key="ticket.id"
        class="group flex items-center gap-3 px-3 py-2 rounded-lg border transition-all"
        :class="[
          ticket.disabled
            ? 'border-divider/50 opacity-40 cursor-not-allowed'
            : bookmarks.selected(ticket.id)
              ? 'border-primary/30 bg-primary/5'
              : 'border-divider hover:border-primary/30',
        ]"
      >
        <Checkbox.Root
          class="size-4.5 rounded border-2 flex items-center justify-center transition-all shrink-0"
          :class="bookmarks.selected(ticket.id)
            ? 'border-primary bg-primary'
            : 'border-divider hover:border-primary'"
          :disabled="!!ticket.disabled"
          :model-value="bookmarks.selected(ticket.id)"
          @update:model-value="bookmarks.toggle(ticket.id)"
        >
          <Checkbox.Indicator class="text-on-primary text-xs">✓</Checkbox.Indicator>
        </Checkbox.Root>

        <div class="flex-1 min-w-0">
          <span
            class="text-sm truncate"
            :class="bookmarks.selected(ticket.id) ? 'text-primary font-medium' : 'text-on-surface'"
          >
            {{ ticket.value }}
          </span>
          <span class="text-[11px] text-on-surface-variant/60 truncate block">{{ ticket.url }}</span>
        </div>

        <div class="flex items-center gap-1.5">
          <span
            v-for="tag in ticket.tags"
            :key="tag"
            class="px-1.5 py-0.5 text-[10px] rounded font-medium bg-surface-variant/50 text-on-surface-variant"
          >
            {{ tag }}
          </span>
        </div>

        <button
          v-if="!ticket.disabled"
          class="transition-all"
          :class="bookmarks.pinned(ticket.id) ? 'text-warning' : 'text-on-surface-variant/30 hover:text-warning/60'"
          @click="bookmarks.pinned(ticket.id) ? bookmarks.unpin(ticket.id) : bookmarks.pin(ticket.id)"
        >
          <svg class="size-4" viewBox="0 0 24 24">
            <path :d="bookmarks.pinned(ticket.id) ? mdiPin : mdiPinOutline" fill="currentColor" />
          </svg>
        </button>
      </div>

      <p
        v-if="filtered.length === 0"
        class="text-center text-sm text-on-surface-variant py-4"
      >
        {{ filter ? `No bookmarks tagged "${filter}".` : 'No bookmarks yet.' }}
      </p>
    </div>

    <!-- Selection summary -->
    <div
      v-if="bookmarks.selectedIds.size > 0"
      class="flex items-center justify-between rounded-lg bg-primary/5 border border-primary/20 px-3 py-2"
    >
      <span class="text-xs text-primary font-medium">
        {{ bookmarks.selectedIds.size }} bookmark{{ bookmarks.selectedIds.size === 1 ? '' : 's' }} selected
      </span>
      <button
        class="text-xs text-primary hover:underline"
        @click="bookmarks.selectedIds.clear()"
      >
        Deselect all
      </button>
    </div>
  </div>
</template>
