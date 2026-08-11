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
    <AppSkeleton height="h-10" :lines="4" />
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

  <ul
    v-else-if="item"
    class="p-2 flex flex-col gap-0.5 list-none m-0"
  >
    <li
      v-for="example in item.examples"
      :key="example.id"
    >
      <button
        class="w-full flex items-center gap-3 text-left rounded-md border border-transparent px-3 py-2 hover:border-primary/40 hover:bg-surface-tint/50 transition-colors disabled:opacity-50"
        :class="opening ? 'cursor-wait' : 'cursor-pointer'"
        :disabled="opening"
        type="button"
        @click="emit('open', example)"
      >
        <span class="min-w-0 flex-1">
          <span class="block text-sm font-medium text-on-surface truncate">
            {{ example.title || example.id }}
          </span>

          <span class="block text-[11px] font-mono text-on-surface-variant/80 truncate mt-0.5">
            {{ example.id }}
          </span>
        </span>

        <span class="shrink-0 text-[10px] tabular-nums text-on-surface-variant">
          {{ example.files.length }} file{{ example.files.length === 1 ? '' : 's' }}
        </span>
      </button>
    </li>
  </ul>
</template>
