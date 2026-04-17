<script setup lang="ts">
  import { useImage } from '@vuetify/v0'
  import { mdiImageBrokenVariant } from '@mdi/js'
  import { shallowRef } from 'vue'

  const src = shallowRef('https://picsum.photos/seed/v0/400/300')

  const { source, status, isLoaded, isError, onLoad, onError } = useImage({
    src,
  })

  function loadBroken () {
    src.value = 'https://invalid.example/missing.jpg'
  }

  function loadValid () {
    src.value = 'https://picsum.photos/seed/v0/400/300'
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="w-100 h-75 bg-surface-tint rounded overflow-hidden flex items-center justify-center">
      <img
        v-show="isLoaded"
        alt="Random photo"
        class="w-full h-full object-cover"
        :src="source"
        @error="onError"
        @load="onLoad"
      >
      <span v-if="!isLoaded && !isError" class="text-on-surface-variant text-sm">
        Loading...
      </span>
      <svg
        v-if="isError"
        aria-label="Image failed to load"
        class="size-24 text-on-surface-variant"
        role="img"
        viewBox="0 0 24 24"
      >
        <path :d="mdiImageBrokenVariant" fill="currentColor" />
      </svg>
    </div>

    <div class="flex gap-2">
      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm"
        @click="loadValid"
      >
        Load valid
      </button>
      <button
        class="px-3 py-1 bg-error text-on-error rounded text-sm"
        @click="loadBroken"
      >
        Load broken
      </button>
    </div>

    <p class="text-xs text-on-surface-variant">
      Status: <code>{{ status }}</code>
    </p>
  </div>
</template>
