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
  background: var(--emerald-neutral-alpha-30, rgba(51, 51, 51, 0.3));
}

.emerald-dialog__content {
  display: flex;
  flex-direction: column;
  gap: var(--emerald-spacing-xl, 24px);
  width: fit-content;
  max-width: 100%;
  padding: var(--emerald-spacing-4xl, 48px) var(--emerald-spacing-5xl, 56px);
  background: var(--emerald-background, #fefefe);
  border-radius: var(--emerald-radius-m, 8px);
  overflow: clip;
  box-shadow: var(--emerald-shadow-l, 0px 5px 12px -1px rgba(51, 51, 51, 0.2));
  font-family: var(--emerald-font-sans, Manrope, system-ui, -apple-system, sans-serif);
  color: var(--emerald-on-surface, #2b2d2e);
}
</style>
