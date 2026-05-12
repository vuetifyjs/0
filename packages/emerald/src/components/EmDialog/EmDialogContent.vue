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
    class="emerald-dialog"
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

<style>
.emerald-dialog {
  padding: 0;
  margin: auto;
  border: none;
  background: transparent;
  max-width: calc(100vw - 32px);
  max-height: calc(100vh - 32px);
  overflow: visible;
}

.emerald-dialog::backdrop {
  background: rgba(81, 81, 81, 0.3);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.emerald-dialog__content {
  display: flex;
  flex-direction: column;
  width: 520px;
  max-width: 100%;
  background: linear-gradient(to bottom, #ffffff, var(--emerald-background, #faf9ff));
  border: 1px solid var(--emerald-primary-500, #7c5cf6);
  border-radius: 12px;
  overflow: clip;
  box-shadow:
    0 3px 8px 0 rgba(5, 0, 18, 0.13),
    0 2px 4px 0 rgba(5, 0, 18, 0.1);
  font-family: Manrope, system-ui, -apple-system, sans-serif;
}
</style>
