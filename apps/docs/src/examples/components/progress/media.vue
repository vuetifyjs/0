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
        elapsed.value = Math.min(elapsed.value + 0.5, 100)
        buffered.value = Math.min(buffered.value + 1.5, 100)

        if (elapsed.value >= 100) {
          playing.value = false
          if (timer) clearInterval(timer)
        }
      }, 100)
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
      <div class="size-10 rounded bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-xs">
        ♫
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
        class="text-neutral-500 hover:text-on-surface text-sm"
        @click="reset"
      >
        ⏮
      </button>

      <button
        class="size-8 rounded-full bg-on-surface text-surface flex items-center justify-center text-sm"
        @click="toggle"
      >
        {{ playing ? '⏸' : '▶' }}
      </button>

      <button
        class="text-neutral-500 hover:text-on-surface text-sm"
        @click="elapsed = 100; buffered = 100"
      >
        ⏭
      </button>
    </div>
  </div>
</template>
