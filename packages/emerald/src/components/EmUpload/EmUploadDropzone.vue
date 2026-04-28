<script lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  export interface EmUploadDropzoneProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUploadDropzone' })

  const { disabled = false } = defineProps<EmUploadDropzoneProps>()

  const emit = defineEmits<{
    drop: [files: File[]]
  }>()

  const dragging = shallowRef(false)

  function onDragOver (e: DragEvent) {
    e.preventDefault()
    if (!disabled) dragging.value = true
  }

  function onDragLeave () {
    dragging.value = false
  }

  function onDrop (e: DragEvent) {
    e.preventDefault()
    dragging.value = false
    if (disabled) return
    const files = Array.from(e.dataTransfer?.files ?? [])
    emit('drop', files)
  }
</script>

<template>
  <div
    class="emerald-upload__dropzone"
    :data-disabled="disabled || undefined"
    :data-dragging="dragging || undefined"
    @dragleave="onDragLeave"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <slot :dragging />
  </div>
</template>

<style>
.emerald-upload__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px 16px;
  border: 1.5px dashed rgb(var(--emerald-neutral-channels, 26 28 30) / 0.2);
  border-radius: 12px;
  background: var(--emerald-surface, #f5f4ff);
  color: var(--emerald-on-background, #000);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  cursor: pointer;
  overflow: clip;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    transform 160ms ease;
}

.emerald-upload__dropzone:hover:not([data-disabled]) {
  border-color: rgb(var(--emerald-primary-500-channels) / 0.5);
  background: rgb(var(--emerald-primary-500-channels) / 0.06);
}

.emerald-upload__dropzone[data-dragging] {
  border-color: var(--emerald-primary-500);
  background: rgb(var(--emerald-primary-500-channels) / 0.10);
  transform: scale(0.99);
}

.emerald-upload__dropzone :deep(svg) {
  color: var(--emerald-primary-500);
}

.emerald-upload__dropzone[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
