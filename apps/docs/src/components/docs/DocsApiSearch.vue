<script setup lang="ts">
  // Composables
  import { useApiFilter } from '@/composables/useApiFilter'

  // Utilities
  import { computed, useTemplateRef } from 'vue'

  const filter = useApiFilter()
  const inputRef = useTemplateRef<HTMLInputElement>('input')

  const query = computed({
    get: () => String(filter.query.value ?? ''),
    set: (value: string) => {
      filter.query.value = value
    },
  })

  const hasQuery = computed(() => query.value.trim().length > 0)

  function onClear () {
    query.value = ''
    inputRef.value?.focus()
  }
</script>

<template>
  <div class="relative mb-6">
    <input
      ref="input"
      v-model="query"
      aria-label="Filter API"
      class="w-full px-4 py-2 pr-10 bg-surface border border-divider rounded-lg text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      placeholder="Filter props, events, slots…"
      type="search"
    >

    <button
      v-if="hasQuery"
      aria-label="Clear filter"
      class="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-tint focus:outline-none focus:ring-1 focus:ring-primary"
      type="button"
      @click="onClear"
    >
      <AppIcon icon="close" :size="16" />
    </button>
  </div>
</template>
