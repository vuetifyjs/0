<script setup lang="ts">
  import { useImage } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const props = defineProps<{
    src: string
    alt: string
  }>()

  const attempts = shallowRef(0)

  const { source, isLoaded, isError, onLoad, onError, retry } = useImage({
    src: toRef(() => props.src),
  })

  function onRetry () {
    attempts.value++
    retry()
  }
</script>

<template>
  <div class="w-full aspect-4/3 bg-surface-tint rounded overflow-hidden relative flex flex-col items-center justify-center gap-2">
    <img
      v-show="isLoaded"
      :alt
      class="w-full h-full object-cover"
      :src="source"
      @error="onError"
      @load="onLoad"
    >

    <template v-if="isError">
      <span class="text-error text-sm">Failed to load</span>
      <span v-if="attempts > 0" class="text-xs text-on-surface-variant">
        Attempt {{ attempts + 1 }}
      </span>
      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm"
        @click="onRetry"
      >
        Retry
      </button>
    </template>

    <span v-else-if="!isLoaded" class="text-on-surface-variant text-sm">
      Loading...
    </span>
  </div>
</template>
