<script setup lang="ts">
  // Framework
  import { useDocumentEventListener } from '@vuetify/v0'

  // Composables
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Utilities
  import { nextTick, toRef, useTemplateRef, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const {
    isOpen,
    isLoading,
    error,
    query,
    groupedResults,
    selectedIndex,
    open,
    close,
    getSelected,
  } = useSearch()

  const router = useRouter()
  const inputRef = useTemplateRef<HTMLInputElement>('input')
  const resultsRef = useTemplateRef<HTMLDivElement>('results')
  const { prefersReducedMotion } = useSettings()
  const transition = toRef(() => prefersReducedMotion.value ? undefined : 'fade')

  watch(isOpen, async opened => {
    if (opened) {
      await nextTick()
      inputRef.value?.focus()
    }
  })

  watch(selectedIndex, async () => {
    await nextTick()
    const container = resultsRef.value
    const selected = container?.querySelector('[data-selected="true"]') as HTMLElement | null
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
    }
  })

  function navigate (path?: string) {
    const target = path ?? getSelected()?.path
    if (target) {
      router.push(target)
      close()
    }
  }

  function onKeydown (e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      isOpen.value ? close() : open()
    }

    if (e.key === 'Enter' && isOpen.value) {
      e.preventDefault()
      navigate()
    }
  }

  useDocumentEventListener('keydown', onKeydown)

  function onHover (index: number) {
    selectedIndex.value = index
  }

  function getFlatIndex (groupIndex: number, itemIndex: number): number {
    let flat = 0
    for (let g = 0; g < groupIndex; g++) {
      flat += groupedResults.value[g]?.items.length ?? 0
    }
    return flat + itemIndex
  }
</script>

<template>
  <Transition :name="transition">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/50 z-50"
      @click="close"
    />
  </Transition>

  <Transition :name="transition">
    <div
      v-if="isOpen"
      aria-label="Search Documentation"
      aria-modal="true"
      class="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-xl z-50 px-4"
      role="dialog"
    >
      <div class="bg-glass-surface rounded-lg shadow-xl border border-divider overflow-hidden">
        <div class="flex items-center gap-3 px-4 py-3 border-b border-divider">
          <AppIcon
            aria-hidden="true"
            class="text-on-surface-variant shrink-0"
            icon="search"
          />
          <input
            ref="input"
            v-model="query"
            aria-label="Search documentation"
            class="flex-1 bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-tint"
            placeholder="Search the docs..."
            type="search"
          >
          <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant text-xs font-mono">
            esc
          </kbd>
        </div>

        <div ref="results" aria-live="polite" class="max-h-80 overflow-y-auto">
          <div
            v-if="isLoading"
            class="px-4 py-8 text-center text-on-surface-variant"
            role="status"
          >
            Loading search index...
          </div>

          <div
            v-else-if="error"
            class="px-4 py-8 text-center text-error"
            role="alert"
          >
            {{ error }}
          </div>

          <div
            v-else-if="!query.trim()"
            class="px-4 py-8 text-center text-on-surface-variant"
            role="status"
          >
            Start typing to search
          </div>

          <div
            v-else-if="groupedResults.length === 0"
            class="px-4 py-8 text-center text-on-surface-variant"
            role="status"
          >
            No results found for "{{ query }}"
          </div>

          <template v-else>
            <div
              v-for="(group, groupIndex) in groupedResults"
              :key="group.category"
            >
              <div class="px-4 py-2 text-xs font-medium text-on-surface-variant uppercase tracking-wide bg-surface-variant/50">
                {{ group.category }}
              </div>
              <button
                v-for="(result, itemIndex) in group.items"
                :key="result.id"
                :class="[
                  'w-full px-4 py-2 flex flex-col gap-0.5 text-left transition-colors cursor-pointer border-0',
                  getFlatIndex(groupIndex, itemIndex) === selectedIndex
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-surface-variant text-on-surface',
                ]"
                :data-selected="getFlatIndex(groupIndex, itemIndex) === selectedIndex"
                type="button"
                @click="navigate(result.path)"
                @mouseenter="onHover(getFlatIndex(groupIndex, itemIndex))"
              >
                <span class="font-medium">{{ result.title }}</span>
                <span
                  v-if="result.headings.length > 0"
                  class="text-xs text-on-surface-variant truncate"
                >
                  {{ result.headings.slice(0, 3).join(' → ') }}
                </span>
              </button>
            </div>
          </template>
        </div>

        <div class="flex items-center justify-between px-4 py-2 border-t border-divider text-xs text-on-surface-variant">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↑</kbd>
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↓</kbd>
              navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 rounded bg-surface-variant font-mono">↵</kbd>
              select
            </span>
          </div>
          <span>Powered by MiniSearch</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
