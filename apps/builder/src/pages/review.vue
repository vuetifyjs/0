<script setup lang="ts">
  import { mdiArrowLeft } from '@mdi/js'

  // Utilities
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'

  import { useBuilderStore } from '@/stores/builder'

  const store = useBuilderStore()
  const router = useRouter()

  const selectedFeatures = computed(() => {
    return store.catalog.filter(f => store.isSelected(f.id))
  })

  const autoFeatures = computed(() => {
    return store.catalog.filter(f => store.resolved.autoIncluded.includes(f.id))
  })

  const total = computed(() => selectedFeatures.value.length + autoFeatures.value.length)
</script>

<template>
  <div class="py-12">
    <div class="flex items-center justify-between mb-8">
      <button class="text-sm text-on-surface-variant hover:text-on-surface transition-colors" @click="router.back()">
        <svg class="w-4 h-4 inline mr-1" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
        Back
      </button>
    </div>

    <h2 class="text-xl font-bold mb-2">Your Framework</h2>
    <p class="text-on-surface-variant mb-8">
      {{ total }} features total — {{ selectedFeatures.length }} selected, {{ autoFeatures.length }} auto-included.
    </p>

    <!-- Stats grid -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="bg-surface rounded-lg p-4 text-center border border-divider">
        <div class="text-2xl font-bold text-primary">{{ selectedFeatures.length }}</div>
        <div class="text-xs text-on-surface-variant mt-1">Selected</div>
      </div>
      <div class="bg-surface rounded-lg p-4 text-center border border-divider">
        <div class="text-2xl font-bold text-accent">{{ autoFeatures.length }}</div>
        <div class="text-xs text-on-surface-variant mt-1">Auto-included</div>
      </div>
      <div class="bg-surface rounded-lg p-4 text-center border border-divider">
        <div class="text-2xl font-bold text-on-surface">{{ total }}</div>
        <div class="text-xs text-on-surface-variant mt-1">Total</div>
      </div>
    </div>

    <!-- Selected -->
    <div v-if="selectedFeatures.length > 0" class="mb-8">
      <h3 class="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 pl-3 border-l-2 border-primary">You selected</h3>
      <div class="flex flex-col gap-2">
        <div
          v-for="feature in selectedFeatures"
          :key="feature.id"
          class="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-surface"
        >
          <div>
            <span class="font-medium text-on-surface">{{ feature.name }}</span>
            <span class="text-xs text-on-surface-variant ml-2">{{ feature.id }}</span>
          </div>
          <button class="text-xs text-error hover:underline" @click="store.deselect(feature.id)">
            Remove
          </button>
        </div>
      </div>
    </div>

    <!-- Auto-included -->
    <div v-if="autoFeatures.length > 0" class="mb-8">
      <h3 class="text-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 pl-3 border-l-2 border-accent">Auto-included dependencies</h3>
      <div class="flex flex-col gap-2">
        <div
          v-for="feature in autoFeatures"
          :key="feature.id"
          class="flex items-center p-3 rounded-lg border border-dashed border-divider bg-surface/50"
        >
          <span class="text-on-surface-variant">{{ feature.name }}</span>
          <span class="text-xs text-on-surface-variant/70 ml-2">{{ feature.id }}</span>
        </div>
      </div>
    </div>

    <!-- Warnings -->
    <div v-if="store.resolved.warnings.length > 0" class="mb-8">
      <h3 class="text-sm font-semibold text-warning uppercase tracking-wide mb-3">Warnings</h3>
      <div
        v-for="warning in store.resolved.warnings"
        :key="warning.featureId"
        class="p-3 rounded-lg border border-warning/30 bg-warning/5 text-sm text-on-surface-variant"
      >
        {{ warning.message }}
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="selectedFeatures.length === 0" class="text-center py-12">
      <p class="text-on-surface-variant">No features selected. Go back and pick some!</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 mt-8">
      <button
        class="flex-1 px-4 py-3 bg-primary text-on-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        :class="{ 'opacity-50 cursor-not-allowed': selectedFeatures.length === 0 }"
        :disabled="selectedFeatures.length === 0"
        @click="store.openInPlayground()"
      >
        Try in Playground →
      </button>
    </div>
  </div>
</template>
