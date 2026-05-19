<script lang="ts">
  export interface EmUploadInputProps {
    accept?: string
    multiple?: boolean
    disabled?: boolean
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUploadInput' })

  const {
    accept,
    multiple = false,
    disabled = false,
    name,
  } = defineProps<EmUploadInputProps>()

  const emit = defineEmits<{
    change: [files: File[]]
  }>()

  function onChange (e: Event) {
    const target = e.target as HTMLInputElement
    const files = Array.from(target.files ?? [])
    emit('change', files)
  }
</script>

<template>
  <input
    :accept
    class="emerald-upload__input"
    :disabled
    :multiple
    :name
    type="file"
    @change="onChange"
  >
</template>

<style>
.emerald-upload__input {
  font: inherit;
  color: inherit;
}
</style>
