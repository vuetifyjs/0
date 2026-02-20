<script setup lang="ts">
  // Components
  import PlaygroundTabs from '@/components/playground/PlaygroundTabs.vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const { store, isDesktop, isVertical, mobileView, hideTabs } = defineProps<{
    store: ReplStore
    isDesktop: boolean
    isVertical: boolean
    mobileView: 'editor' | 'preview'
    hideTabs: boolean
  }>()

  const emit = defineEmits<{
    'update:mobileView': ['editor' | 'preview']
    'toggle-layout': []
  }>()
</script>

<template>
  <div v-if="!hideTabs" class="flex items-stretch">
    <PlaygroundTabs class="flex-1 min-w-0" :store="store" />

    <template v-if="!isDesktop">
      <button
        class="px-3 text-xs font-medium border-b border-l border-divider transition-colors"
        :class="mobileView === 'editor' ? 'bg-surface-tint text-on-surface' : 'bg-surface-variant/30 text-on-surface-variant'"
        @click="emit('update:mobileView', 'editor')"
      >
        Code
      </button>
      <button
        class="px-3 text-xs font-medium border-b border-l border-divider transition-colors"
        :class="mobileView === 'preview' ? 'bg-surface-tint text-on-surface' : 'bg-surface-variant/30 text-on-surface-variant'"
        @click="emit('update:mobileView', 'preview')"
      >
        Preview
      </button>
    </template>

    <button
      v-else
      class="shrink-0 flex items-center justify-center w-9 border-b border-l border-divider bg-surface-variant/30 hover:bg-surface-tint transition-colors"
      :title="isVertical ? 'Switch to side-by-side layout' : 'Switch to stacked layout'"
      @click="emit('toggle-layout')"
    >
      <AppIcon :icon="isVertical ? 'layout-horizontal' : 'layout-vertical'" :size="16" />
    </button>
  </div>
</template>
