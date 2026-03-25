<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { DialogContent } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmDialogContentProps extends V0PaperProps {
    closeOnClickOutside?: boolean
    blocking?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDialogContent' })

  const {
    closeOnClickOutside = true,
    blocking = false,
    ...paperProps
  } = defineProps<EmDialogContentProps>()

  const emit = defineEmits<{
    cancel: [e: Event]
    close: [e: Event]
  }>()
</script>

<template>
  <DialogContent
    :blocking
    :close-on-click-outside
    @cancel="emit('cancel', $event)"
    @close="emit('close', $event)"
  >
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="emerald-dialog__content"
    >
      <slot />
    </V0Paper>
  </DialogContent>
</template>

<style scoped>
.emerald-dialog__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
