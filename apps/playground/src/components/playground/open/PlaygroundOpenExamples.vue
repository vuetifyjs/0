<script setup lang="ts">
  // Components
  import AppSkeleton from '@/components/app/AppSkeleton.vue'

  // Types
  import type { RegistryExample, RegistryItem } from '@/data/registry'

  const {
    item,
    loading = false,
    error,
    opening = false,
  } = defineProps<{
    item?: RegistryItem
    loading?: boolean
    error?: string
    opening?: boolean
  }>()

  const emit = defineEmits<{
    open: [example: RegistryExample]
    retry: []
  }>()
</script>

<template>
  <div v-if="loading" class="p-4">
    <AppSkeleton height="h-14" :lines="3" />
  </div>

  <div
    v-else-if="error"
    class="p-8 text-center flex flex-col gap-2 items-center"
  >
    <p class="text-sm text-on-surface-variant">{{ error }}</p>

    <button
      class="text-xs font-medium text-primary hover:underline"
      type="button"
      @click="emit('retry')"
    >
      Retry
    </button>
  </div>

  <div v-else-if="item" class="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
    <button
      v-for="example in item.examples"
      :key="example.id"
      class="text-left rounded-lg border border-divider bg-surface hover:border-primary/50 hover:bg-surface-tint/50 transition-colors p-3 disabled:opacity-50"
      :class="opening ? 'cursor-wait' : ''"
      :disabled="opening"
      type="button"
      @click="emit('open', example)"
    >
      <div class="h-12 rounded-md border border-divider bg-surface-tint/50 mb-2.5 flex items-center justify-center">
        <span class="text-[10px] text-on-surface-variant/70 font-mono">
          {{ example.id }}
        </span>
      </div>

      <div class="text-sm font-medium text-on-surface truncate">
        {{ example.title || example.id }}
      </div>

      <div class="text-[11px] text-on-surface-variant mt-0.5">
        {{ example.files.length }} file{{ example.files.length === 1 ? '' : 's' }}
      </div>
    </button>
  </div>
</template>
