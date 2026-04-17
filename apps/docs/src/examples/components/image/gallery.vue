<script setup lang="ts">
  import GalleryImage from './GalleryImage.vue'
  import { shallowRef, watch } from 'vue'

  const photos = [
    { id: 1, src: 'https://picsum.photos/seed/gallery-1/600/450', alt: 'Photo 1' },
    { id: 2, src: 'https://picsum.photos/seed/gallery-2/600/450', alt: 'Photo 2' },
    { id: 3, src: 'https://picsum.photos/seed/gallery-3/600/450', alt: 'Photo 3' },
    { id: 4, src: 'https://picsum.photos/seed/gallery-4/600/450', alt: 'Photo 4' },
  ]

  // Simulated network delay so the transition is visible even when the
  // browser has cached the response.
  const DELAY_MS = 1200

  const index = shallowRef(0)
  const displayedSrc = shallowRef(photos[0]!.src)
  const displayedAlt = shallowRef(photos[0]!.alt)
  const pending = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(index, next => {
    const target = photos[next]!
    pending.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      displayedSrc.value = target.src
      displayedAlt.value = target.alt
      pending.value = false
    }, DELAY_MS)
  })

  function onNext () {
    index.value = (index.value + 1) % photos.length
  }

  function onPrev () {
    index.value = (index.value - 1 + photos.length) % photos.length
  }
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full max-w-lg mx-auto">
    <GalleryImage :alt="displayedAlt" :src="displayedSrc" />

    <div class="flex items-center gap-4">
      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm disabled:opacity-50"
        :disabled="pending"
        @click="onPrev"
      >
        Previous
      </button>

      <span class="text-sm text-on-surface-variant">
        {{ pending ? 'loading…' : `${index + 1} / ${photos.length}` }}
      </span>

      <button
        class="px-3 py-1 bg-primary text-on-primary rounded text-sm disabled:opacity-50"
        :disabled="pending"
        @click="onNext"
      >
        Next
      </button>
    </div>

    <p class="text-xs text-on-surface-variant text-center max-w-md">
      A {{ DELAY_MS }}&thinsp;ms simulated delay stands in for a slow network. During the delay the previous photo stays on screen — no placeholder flash — and the next photo crossfades in once it loads.
    </p>
  </div>
</template>
