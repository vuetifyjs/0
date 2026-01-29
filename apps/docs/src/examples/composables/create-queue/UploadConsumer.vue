<script setup lang="ts">
  import { useUploads } from './context'

  const { first, pending, size, add, cancel } = useUploads()

  const files = [
    { name: 'presentation.pdf', size: '2.4 MB' },
    { name: 'photo-001.jpg', size: '856 KB' },
    { name: 'video-clip.mp4', size: '12.1 MB' },
    { name: 'document.docx', size: '340 KB' },
    { name: 'archive.zip', size: '8.7 MB' },
  ]

  let fileIndex = 0
  function addFile () {
    const file = files[fileIndex % files.length]!
    fileIndex++
    add(file.name, file.size)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Controls -->
    <div class="flex items-center justify-center gap-3">
      <button
        class="px-4 py-2 border border-primary text-primary bg-transparent rounded-lg font-medium hover:bg-primary/10 transition-colors"
        @click="addFile"
      >
        ({{ size }})
        Add File
      </button>
    </div>

    <!-- Upload status container (consistent sizing) -->
    <div
      class="p-4 border rounded-lg transition-colors"
      :class="first ? 'bg-surface border-primary' : 'border-dashed border-divider'"
    >
      <!-- Active upload -->
      <template v-if="first">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs text-primary font-medium uppercase tracking-wide">Uploading</span>
          <button
            class="text-xs text-on-surface-variant hover:text-error transition-colors"
            @click="cancel(first.id)"
          >
            Cancel
          </button>
        </div>
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-on-surface truncate">{{ first.name }}</span>
          <span class="text-xs text-on-surface-variant ml-2 shrink-0">{{ first.size }}</span>
        </div>
        <div
          :aria-label="`${first.name} upload progress`"
          aria-valuemax="100"
          aria-valuemin="0"
          :aria-valuenow="Math.round(first.progress.value)"
          class="h-2 bg-primary rounded-full overflow-hidden"
          role="progressbar"
        >
          <div
            class="h-full bg-surface-variant rounded-full transition-all duration-100 ml-auto"
            :style="{ width: `${100 - first.progress.value}%` }"
          />
        </div>
        <div class="text-right text-xs text-primary font-mono mt-1">
          {{ Math.round(first.progress.value) }}%
        </div>
      </template>

      <!-- Empty state (matches first structure exactly) -->
      <div v-else class="relative">
        <div class="flex items-center justify-between mb-1">
          <span class="text-xs invisible">Uploading</span>
          <span class="text-xs invisible">Cancel</span>
        </div>
        <div class="mb-2">
          <span class="font-medium invisible">placeholder</span>
        </div>
        <div class="h-2" />
        <div class="text-right text-xs font-mono mt-1 invisible">0%</div>
        <span class="absolute inset-0 flex items-center justify-center text-on-surface-variant text-sm opacity-50">
          No files in queue
        </span>
      </div>
    </div>

    <!-- Pending queue -->
    <div v-if="pending.length > 0" class="flex flex-col gap-2">
      <span class="text-xs text-on-surface-variant uppercase tracking-wide">
        Waiting ({{ pending.length }})
      </span>
      <TransitionGroup
        class="flex flex-col gap-1"
        name="queue"
        tag="div"
      >
        <div
          v-for="(upload, i) in pending"
          :key="upload.id"
          class="flex items-center justify-between px-3 py-2 bg-surface-variant/50 border border-divider rounded"
        >
          <div class="flex items-center gap-3">
            <span class="text-xs text-on-surface-variant/50 font-mono w-4">#{{ i + 2 }}</span>
            <span class="text-sm text-on-surface">{{ upload.name }}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-on-surface-variant">{{ upload.size }}</span>
            <button
              :aria-label="`Remove ${upload.name} from queue`"
              class="text-xs text-on-surface-variant/50 hover:text-error transition-colors"
              @click="cancel(upload.id)"
            >
              ×
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
  .queue-move,
  .queue-enter-active,
  .queue-leave-active {
    transition: opacity 0.2s ease;
  }

  .queue-enter-from,
  .queue-leave-to {
    opacity: 0;
  }
</style>
