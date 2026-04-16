/* eslint-disable vuejs-accessibility/alt-text */
<script setup lang="ts">
  import { useImage } from '@vuetify/v0'

  const { source, isLoaded, isError, status, onLoad, onError, retry } = useImage({
    src: 'https://invalid.example/missing.jpg',
  })
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="w-100 h-75 bg-surface-tint rounded overflow-hidden flex flex-col items-center justify-center gap-2">
      <img
        v-show="isLoaded"
        alt="Photo"
        class="w-full h-full object-cover"
        :src="source"
        @error="onError"
        @load="onLoad"
      >

      <template v-if="isError">
        <span class="text-error text-sm">Failed to load</span>
        <button
          class="px-3 py-1 bg-primary text-on-primary rounded text-sm"
          @click="retry"
        >
          Retry
        </button>
      </template>

      <span v-else-if="!isLoaded" class="text-on-surface-variant text-sm">
        Loading...
      </span>
    </div>

    <p class="text-xs text-on-surface-variant">
      Status: <code>{{ status }}</code>
    </p>
  </div>
</template>
