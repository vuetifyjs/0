<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmUploadProps extends V0PaperProps {
    accept?: string
    multiple?: boolean
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmUpload' })

  // TODO(emerald): flesh out vs createQueue for upload progress/list when v0 primitive lands
  const {
    accept,
    multiple = false,
    disabled = false,
    ...paperProps
  } = defineProps<EmUploadProps>()

  const model = defineModel<File[]>({ default: () => [] })
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-upload"
    :data-disabled="disabled || undefined"
  >
    <slot
      :accept
      :disabled
      :files="model"
      :multiple
    />
  </V0Paper>
</template>

<style>
.emerald-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-on-background);
}

.emerald-upload[data-disabled] {
  opacity: 0.6;
  pointer-events: none;
}
</style>
