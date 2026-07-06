<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { ToggleRoot } from '@vuetify/v0'

  // Utilities
  import { mergeProps } from 'vue'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmTagVariant =
    | 'neutral'
    | 'success'
    | 'danger'
    | 'alert'
    | 'info'

  export interface EmTagProps extends V0PaperProps {
    variant?: EmTagVariant
    selectable?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTag' })

  const {
    variant = 'neutral',
    selectable = false,
    ...paperProps
  } = defineProps<EmTagProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const selected = defineModel<boolean>('selected', { default: false })

  function onClick (event: MouseEvent) {
    emit('click', event)
  }
</script>

<template>
  <ToggleRoot v-model="selected" renderless>
    <template #default="{ attrs }">
      <V0Paper
        v-bind="selectable ? mergeProps(paperProps, attrs) : paperProps"
        :as="selectable ? 'button' : 'span'"
        class="emerald-tag"
        :data-selected="selected || undefined"
        :data-variant="variant"
        @click="onClick"
      >
        <slot :selected />
      </V0Paper>
    </template>
  </ToggleRoot>
</template>

<style scoped>
.emerald-tag {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--emerald-spacing-3xs);
  height: var(--emerald-text-b3-height);
  padding: 0 var(--emerald-spacing-2xs);
  border: var(--emerald-stroke-s) solid var(--emerald-border);
  border-radius: var(--emerald-radius-full);
  background: var(--emerald-background);
  color: var(--emerald-on-surface);
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b3-size);
  font-weight: var(--emerald-text-b3-weight);
  line-height: var(--emerald-text-b3-height);
  letter-spacing: 0;
  white-space: nowrap;
}

button.emerald-tag {
  cursor: pointer;
  user-select: none;
}

/* ─── State: hover ───────────────────────────────────── */
.emerald-tag:hover {
  box-shadow: var(--emerald-shadow-m);
}

/* ─── Icon sizing (bare svg slot content, 16px) ──────── */
.emerald-tag > :deep(svg) {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

/* ─── Variant: neutral ───────────────────────────────── */
.emerald-tag[data-variant="neutral"] {
  border-color: var(--emerald-border);
}

.emerald-tag[data-variant="neutral"][data-selected] {
  background: var(--emerald-neutral-200);
}

/* ─── Variant: success ───────────────────────────────── */
.emerald-tag[data-variant="success"] {
  border-color: var(--emerald-success-200);
}

.emerald-tag[data-variant="success"][data-selected] {
  background: var(--emerald-primary-100);
  border-color: var(--emerald-primary-300);
}

/* ─── Variant: danger ────────────────────────────────── */
.emerald-tag[data-variant="danger"] {
  border-color: var(--emerald-danger-200);
}

.emerald-tag[data-variant="danger"][data-selected] {
  background: var(--emerald-danger-100);
}

/* ─── Variant: info ──────────────────────────────────── */
.emerald-tag[data-variant="info"] {
  border-color: var(--emerald-info-300);
}

.emerald-tag[data-variant="info"][data-selected] {
  background: var(--emerald-info-100);
}

/* ─── Variant: alert ─────────────────────────────────── */
.emerald-tag[data-variant="alert"] {
  border-color: var(--emerald-alert-300);
}

.emerald-tag[data-variant="alert"][data-selected] {
  background: var(--emerald-alert-100);
}
</style>
