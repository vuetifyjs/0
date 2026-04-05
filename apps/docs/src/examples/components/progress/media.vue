<script setup lang="ts">
  import MediaProgress from './MediaProgress.vue'
  import { onUnmounted, shallowRef } from 'vue'

  const elapsed = shallowRef(0)
  const buffered = shallowRef(0)
  const playing = shallowRef(false)
  let timer: ReturnType<typeof setInterval> | null = null

  function toggle () {
    playing.value = !playing.value

    if (playing.value) {
      timer = setInterval(() => {
        elapsed.value = Math.min(elapsed.value + 1, 100)
        buffered.value = Math.min(buffered.value + 3, 100)

        if (elapsed.value >= 100) {
          playing.value = false
          if (timer) clearInterval(timer)
        }
      }, 200)
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
  <div class="flex flex-col gap-3 w-full">
    <MediaProgress v-model="elapsed" :buffer="buffered" />

    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800"
        @click="toggle"
      >
        {{ playing ? 'Pause' : 'Play' }}
      </button>

      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800"
        @click="reset"
      >
        Reset
      </button>

      <span class="text-sm text-neutral-500 ml-auto">
        {{ elapsed }}% — buffered {{ buffered }}%
      </span>
    </div>
  </div>
</template>
