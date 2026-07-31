<script setup lang="ts">
  import { useImageCard } from './useImageCard'
  import { mdiImageBrokenVariant, mdiReload } from '@mdi/js'
  import { toRef } from 'vue'

  const props = defineProps<{
    src: string
    fallback?: string
    alt: string
    label: string
  }>()

  const { source, status, isLoaded, isError, isFallback, onLoad, onError, reload } = useImageCard(
    toRef(() => props.src),
    toRef(() => props.fallback),
  )
</script>

<template>
  <div class="flex flex-col gap-2 border border-divider rounded p-3 bg-surface">
    <div class="flex items-center justify-between gap-2">
      <span class="text-sm font-medium text-on-surface">{{ label }}</span>

      <span
        class="text-xs px-2 py-0.5 rounded capitalize"
        :class="{
          'bg-surface-variant text-on-surface-variant': status === 'idle' || status === 'loading',
          'bg-success text-on-success': status === 'loaded',
          'bg-error text-on-error': status === 'error',
        }"
      >
        {{ status }}
      </span>
    </div>

    <div class="aspect-4/3 bg-surface-tint rounded overflow-hidden relative flex items-center justify-center">
      <img
        v-show="isLoaded"
        :alt
        class="w-full h-full object-cover"
        :src="source"
        @error="onError"
        @load="onLoad"
      >

      <span v-if="!isLoaded && !isError" class="text-on-surface-variant text-sm">
        Loading...
      </span>

      <div v-if="isError" class="flex flex-col items-center gap-1 text-on-surface-variant">
        <svg aria-label="Image failed to load" class="size-12" role="img" viewBox="0 0 24 24">
          <path :d="mdiImageBrokenVariant" fill="currentColor" />
        </svg>

        <span class="text-xs">Unavailable</span>
      </div>

      <span
        v-if="isFallback && isLoaded"
        class="absolute top-2 left-2 text-xs px-2 py-0.5 rounded bg-warning text-on-warning"
      >
        Fallback
      </span>
    </div>

    <button
      class="self-start inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary text-on-primary"
      @click="reload"
    >
      <svg class="size-3.5" viewBox="0 0 24 24">
        <path :d="mdiReload" fill="currentColor" />
      </svg>
      Reload
    </button>
  </div>
</template>
