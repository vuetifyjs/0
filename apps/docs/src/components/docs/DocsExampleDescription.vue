<script setup lang="ts">
  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'
  import { shallowRef, useSlots, computed } from 'vue'

  defineProps<{
    anchorId?: string
    collapse?: boolean
    title?: string
  }>()

  const scroll = useScrollToAnchor()
  const slots = useSlots()

  const expanded = shallowRef(false)

  const hasContent = computed(() => !!slots.default)
</script>

<template>
  <div
    v-if="title || hasContent"
    class="relative px-5 pt-4 border-b border-divider bg-surface-variant"
  >
    <h3
      v-if="title"
      :id="anchorId"
      class="font-semibold text-lg m-0"
    >
      <a
        v-if="anchorId"
        class="header-anchor"
        :href="`#${anchorId}`"
        @click.prevent="scroll.scrollToAnchor(anchorId)"
      >{{ title }}</a>
      <template v-else>{{ title }}</template>
    </h3>

    <div
      v-if="hasContent"
      class="docs-example-description text-on-surface-variant"
      :class="title && 'mt-1'"
    >
      <div
        class="overflow-hidden transition-[max-height] duration-300"
        :class="expanded ? 'max-h-none' : 'max-h-18'"
      >
        <slot />
      </div>
    </div>

    <!-- Fade gradient (positioned relative to outer container) -->
    <div
      v-if="hasContent && !expanded"
      class="docs-description-fade absolute inset-x-0 bottom-0 h-16 pointer-events-none"
    />

    <template v-if="hasContent">
      <button
        v-if="!expanded && collapse"
        aria-label="Expand description"
        class="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex items-center justify-center gap-1 px-2 py-1 text-xs text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85"
        type="button"
        @click="expanded = true"
      >
        <span>Expand</span>
        <AppIcon icon="down" :size="14" />
      </button>

      <button
        v-if="!collapse || expanded"
        :aria-label="`${expanded ? 'Collapse' : 'Expand'} description`"
        class="absolute top-3 right-3 z-10 inline-flex items-center justify-center size-7 text-on-primary bg-primary rounded cursor-pointer transition-200 hover:bg-primary/85"
        :title="`${expanded ? 'Collapse' : 'Expand'} description`"
        type="button"
        @click="expanded = !expanded"
      >
        <AppIcon :icon="expanded ? 'fullscreen-exit' : 'fullscreen'" :size="16" />
      </button>
    </template>
  </div>
</template>

<style>
  .docs-description-fade {
    background: var(--v0-surface-variant);
    mask: linear-gradient(transparent, var(--v0-primary));
  }
</style>

<style scoped>
  .docs-example-description :deep(p) {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .docs-example-description :deep(h3) {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }

  .docs-example-description :deep(h4) {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }
</style>
