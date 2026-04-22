<script setup lang="ts">
  import { useUpload } from './useUpload'
  import { toValue } from 'vue'

  const { files, percent, isIndeterminate, upload, clear, fromValue } = useUpload()

  const names = ['photo.jpg', 'report.pdf', 'video.mp4', 'backup.zip', 'notes.md']
  let index = 0

  function add () {
    upload(names[index % names.length]!)
    index++
  }
</script>

<template>
  <div class="flex flex-col gap-4 w-full">
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded text-sm bg-blue-500 text-white"
        @click="add"
      >
        Add file
      </button>

      <button
        class="px-3 py-1 rounded text-sm bg-neutral-200 dark:bg-neutral-800"
        @click="clear"
      >
        Clear
      </button>

      <span class="text-sm text-neutral-500 ml-auto">
        {{ isIndeterminate ? 'Idle' : `${Math.round(percent)}% total` }}
      </span>
    </div>

    <div v-if="files.length > 0" class="flex flex-col gap-2">
      <div
        v-for="file in files"
        :key="file.ticket.id"
        class="flex items-center gap-3"
      >
        <span class="text-sm w-24 truncate">{{ file.name }}</span>

        <div class="relative flex-1 h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            class="h-full rounded-full transition-all"
            :class="file.status === 'complete' ? 'bg-green-500' : 'bg-blue-500'"
            :style="{ width: `${fromValue(toValue(file.ticket.value))}%` }"
          />
        </div>

        <span class="text-sm text-neutral-500 w-10 text-right">
          {{ file.status === 'complete' ? '\u2713' : `${Math.round(toValue(file.ticket.value))}%` }}
        </span>
      </div>
    </div>
  </div>
</template>
