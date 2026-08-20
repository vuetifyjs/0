<script setup lang="ts">
  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Data
  import { resolveFeatureAccent, resolveFeatureIcon } from '@/data/feature-icons'
  import { DEFAULT_REGISTRY } from '@/data/registry'

  // Local
  import { blurb, exampleLabel, featureBucket, featureKindLabel } from './types'

  // Types
  import type { RegistryIndexEntry } from '@/data/registry'

  const {
    items,
    loading = false,
    error,
    query = '',
    railLabel = 'features',
    total = 0,
    iconOverride,
    lastFeature,
  } = defineProps<{
    items: RegistryIndexEntry[]
    loading?: boolean
    error?: string
    query?: string
    railLabel?: string
    /** Unfiltered count for empty-rail vs empty-filter copy. */
    total?: number
    /** Force every card to this AppIcon token (e.g. `vuetify` for V4 rail). */
    iconOverride?: string
    /** Feature name last opened — wayfinding highlight. */
    lastFeature?: string
  }>()

  const emit = defineEmits<{
    select: [entry: RegistryIndexEntry]
    retry: []
  }>()

  function featureIcon (entry: RegistryIndexEntry) {
    return iconOverride || resolveFeatureIcon(entry.name, entry.category)
  }

  function featureAccent (entry: RegistryIndexEntry) {
    return resolveFeatureAccent(entry.type, entry.category)
  }

  function docsHref (entry: RegistryIndexEntry) {
    const docs = entry.docs?.trim()
    return docs || undefined
  }

  function isLast (entry: RegistryIndexEntry) {
    return Boolean(lastFeature && entry.name === lastFeature)
  }

  function kindLabel (entry: RegistryIndexEntry) {
    return featureKindLabel(featureBucket(entry))
  }
</script>

<template>
  <div v-if="loading" class="p-4">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div
        v-for="i in 6"
        :key="i"
        class="h-28 rounded-lg bg-surface-tint animate-pulse"
      />
    </div>
  </div>

  <div
    v-else-if="error"
    class="p-8 text-center flex flex-col gap-2 items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">{{ error }}</p>

    <p class="text-xs text-on-surface-variant/70">
      Origin: {{ DEFAULT_REGISTRY }}/registry
    </p>

    <button
      class="text-xs font-medium text-primary hover:underline mt-1"
      type="button"
      @click="emit('retry')"
    >
      Retry
    </button>
  </div>

  <div
    v-else-if="total === 0"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">
      No {{ railLabel.toLowerCase() }} with examples
    </p>
  </div>

  <div
    v-else-if="items.length === 0"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">
      No matches{{ query ? ` for “${query}”` : '' }}
    </p>
  </div>

  <div v-else class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
    <button
      v-for="entry in items"
      :key="`${entry.type}/${entry.name}`"
      class="text-left rounded-lg border bg-surface hover:border-primary/50 hover:bg-surface-tint/40 transition-colors px-3 py-2.5 group"
      :class="isLast(entry)
        ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/25'
        : 'border-divider'"
      type="button"
      @click="emit('select', entry)"
    >
      <div class="flex items-start gap-2.5">
        <div
          class="w-8 h-8 rounded-md border border-divider/50 shrink-0 flex items-center justify-center mt-0.5"
          :style="{ background: featureAccent(entry).bg }"
        >
          <AppIcon
            :icon="featureIcon(entry)"
            :size="16"
            :style="{ color: featureAccent(entry).fg, opacity: 1 }"
          />
        </div>

        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 min-w-0">
            <div class="text-sm font-medium text-on-surface truncate group-hover:text-primary transition-colors">
              {{ entry.title || entry.name }}
            </div>

            <span
              v-if="isLast(entry)"
              class="shrink-0 text-[9px] font-medium uppercase tracking-wide text-primary px-1.5 py-0.5 rounded bg-primary/10"
            >
              Last
            </span>
          </div>

          <div
            v-if="entry.description"
            class="text-[11px] text-on-surface-variant mt-0.5 line-clamp-2 leading-snug"
          >
            {{ blurb(entry.description) }}
          </div>

          <div class="flex items-center justify-between gap-2 mt-1.5 text-[10px] text-on-surface-variant">
            <span class="tabular-nums">{{ exampleLabel(entry.examples.length) }}</span>

            <span class="flex items-center gap-2 min-w-0">
              <span class="truncate">{{ kindLabel(entry) }}</span>

              <a
                v-if="docsHref(entry)"
                class="shrink-0 text-primary hover:underline"
                :href="docsHref(entry)"
                rel="noopener noreferrer"
                target="_blank"
                @click.stop
              >
                Docs ↗
              </a>
            </span>
          </div>
        </div>
      </div>
    </button>
  </div>
</template>
