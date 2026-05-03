<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'

  // Context
  import { usePlayground } from './PlaygroundApp.vue'

  // Utilities
  import { computed, nextTick, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  interface VuetifyPlayground {
    id: string
    title: string
    content?: string
    createdAt: string
    updatedAt: string
  }

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const items = ref<VuetifyPlayground[]>([])
  const loading = shallowRef(true)
  const error = shallowRef<string>()
  const query = shallowRef('')
  const input = useTemplateRef<HTMLInputElement>('input')

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return items.value
    return items.value.filter(item => (item.title || '').toLowerCase().includes(q))
  })

  onMounted(async () => {
    try {
      const res = await fetch('https://api.vuetifyjs.com/one/playgrounds', {
        credentials: 'include',
      })

      if (!res.ok) {
        error.value = res.status === 401
          ? 'Session expired. Please sign in again.'
          : `Failed to load playgrounds (${res.status})`
        return
      }

      const data = await res.json()
      items.value = data.playgrounds ?? data
    } catch {
      error.value = 'Failed to load playgrounds'
    } finally {
      loading.value = false
      nextTick(() => input.value?.focus())
    }
  })

  function formatDate (iso: string) {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  async function open (item: VuetifyPlayground) {
    let content = item.content
    if (!content) {
      const res = await fetch(`https://api.vuetifyjs.com/one/playgrounds/${item.id}`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      content = data.content ?? data.playground?.content
    }
    if (!content) return
    emit('close')
    await playground.openPlayground(content)
  }
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      tabindex="-1"
      @keydown.esc="$emit('close')"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <div
        aria-labelledby="open-title"
        aria-modal="true"
        class="relative bg-surface border border-divider rounded-lg shadow-xl w-[480px] max-h-[520px] flex flex-col overflow-hidden"
        role="dialog"
      >
        <div class="flex items-center justify-between px-4 py-3 border-b border-divider">
          <h2 id="open-title" class="text-sm font-medium">
            Open Playground
          </h2>

          <AppCloseButton @click="$emit('close')" />
        </div>

        <div v-if="!loading && !error && items.length > 0" class="px-4 py-2 border-b border-divider">
          <input
            ref="input"
            v-model="query"
            class="w-full bg-transparent text-sm text-on-surface outline-none placeholder-on-surface-variant/50"
            placeholder="Search..."
            type="text"
          >
        </div>

        <div class="flex-1 overflow-y-auto">
          <!-- Loading -->
          <div v-if="loading" class="p-4 flex flex-col gap-3">
            <div v-for="i in 4" :key="i" class="h-12 rounded bg-surface-tint animate-pulse" />
          </div>

          <!-- Error -->
          <div v-else-if="error" class="p-6 text-center">
            <p class="text-sm text-on-surface-variant">{{ error }}</p>
          </div>

          <!-- Empty -->
          <div v-else-if="items.length === 0" class="p-6 text-center">
            <p class="text-sm text-on-surface-variant">No playgrounds found</p>
          </div>

          <!-- No matches -->
          <div v-else-if="filtered.length === 0" class="p-6 text-center">
            <p class="text-sm text-on-surface-variant">No matches</p>
          </div>

          <!-- List -->
          <template v-else>
            <button
              v-for="item in filtered"
              :key="item.id"
              class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-tint transition-colors border-b border-divider last:border-b-0"
              type="button"
              @click="open(item)"
            >
              <span class="text-sm text-on-surface truncate">{{ item.title || 'Untitled' }}</span>
              <span class="text-xs text-on-surface-variant shrink-0 ml-4">{{ formatDate(item.updatedAt || item.createdAt) }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>
