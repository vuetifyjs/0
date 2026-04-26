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
  gap: 4px;
  padding: 16px;
  border: 1px dashed rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 12px;
  background: #ffffff;
  color: var(--emerald-on-background, #000);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  overflow: clip;
  transition: border-color 120ms ease, background-color 120ms ease;
}

.emerald-upload__dropzone[data-dragging] {
  border-color: var(--emerald-primary-500);
  background: rgb(var(--emerald-primary-500-channels, 24 180 140) / 0.05);
}

.emerald-upload__dropzone[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
