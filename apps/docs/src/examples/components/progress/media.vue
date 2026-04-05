<script setup lang="ts">
  import MediaProgress from './MediaProgress.vue'
  import { onUnmounted, shallowRef, toRef } from 'vue'

  const elapsed = shallowRef(0)
  const buffered = shallowRef(0)
  const playing = shallowRef(false)
  const duration = 180
  let timer: ReturnType<typeof setInterval> | null = null

  function format (seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const time = toRef(() => format((elapsed.value / 100) * duration))
  const total = toRef(() => format(duration))

  function toggle () {
    playing.value = !playing.value

    if (playing.value) {
      timer = setInterval(() => {
        elapsed.value = Math.min(elapsed.value + (100 / duration), 100)
        buffered.value = Math.min(buffered.value + (100 / duration) * 3, 100)

        if (elapsed.value >= 100) {
          playing.value = false
          if (timer) clearInterval(timer)
        }
      }, 333)
    } else if (timer) {
      clearInterval(timer)
    }
  }

  function reset () {
    elapsed.value = 0
    buffered.value = 0
    playing.value = false
    if (timer) clearInterval(timer)
  }

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })
</script>

<template>
  <div class="flex flex-col gap-2 w-full rounded-lg bg-neutral-100 dark:bg-neutral-900 p-4">
    <div class="flex items-center gap-3 mb-1">
      <div class="size-10 rounded bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center">
        <svg class="size-5 text-neutral-500" viewBox="0 0 24 24"><path d="M21 3v12.5a3.5 3.5 0 0 1-3.5 3.5a3.5 3.5 0 0 1-3.5-3.5a3.5 3.5 0 0 1 3.5-3.5c.54 0 1.05.12 1.5.34V6.47L9 8.6v8.9A3.5 3.5 0 0 1 5.5 21A3.5 3.5 0 0 1 2 17.5A3.5 3.5 0 0 1 5.5 14c.54 0 1.05.12 1.5.34V4l14-3z" fill="currentColor" /></svg>
      </div>

      <div class="flex flex-col">
        <span class="text-sm font-medium">Midnight Drive</span>
        <span class="text-xs text-neutral-500">Synthwave Collection</span>
      </div>
    </div>

    <MediaProgress v-model="elapsed" :buffer="buffered" />

    <div class="flex items-center justify-between">
      <span class="text-xs text-neutral-500 tabular-nums">{{ time }}</span>
      <span class="text-xs text-neutral-500 tabular-nums">{{ total }}</span>
    </div>

    <div class="flex items-center justify-center gap-4">
      <button
        class="text-neutral-500 hover:text-on-surface"
        @click="reset"
      >
        <svg class="size-5" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill="currentColor" /></svg>
      </button>

      <button
        class="size-9 rounded-full bg-on-surface text-surface flex items-center justify-center"
        @click="toggle"
      >
        <svg v-if="playing" class="size-5" viewBox="0 0 24 24"><path d="M14 19h4V5h-4M6 19h4V5H6v14z" fill="currentColor" /></svg>
        <svg v-else class="size-5 ml-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
      </button>

      <button
        class="text-neutral-500 hover:text-on-surface"
        @click="elapsed = 100; buffered = 100"
      >
        <svg class="size-5" viewBox="0 0 24 24"><path d="M16 18h2V6h-2M6 18l8.5-6L6 6v12z" fill="currentColor" /></svg>
      </button>
    </div>
  </div>
</template>
