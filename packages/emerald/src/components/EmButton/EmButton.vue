<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Context
  import EmButtonContent from './EmButtonContent.vue'
  import EmButtonLoader from './EmButtonLoader.vue'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmButtonSize = 'sm' | 'md' | 'lg'

  export type EmButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'destructive'

  export interface EmButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
    size?: EmButtonSize
    variant?: EmButtonVariant
    type?: 'button' | 'submit' | 'reset'
    href?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {
    disabled = false,
    loading = false,
    size = 'md',
    variant = 'primary',
    type = 'button',
    href,
    ...paperProps
  } = defineProps<EmButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled || loading) {
      event.preventDefault()

      return
    }

    emit('click', event)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-busy="loading || undefined"
    :aria-disabled="(disabled || loading) || undefined"
    :as="href ? 'a' : 'button'"
    class="emerald-button"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    :data-size="size"
    :data-variant="variant"
    :disabled="(disabled || loading) || undefined"
    :href="(disabled || loading) ? undefined : href"
    :type="href ? undefined : type"
    @click="onClick"
  >
    <span v-if="loading" class="emerald-button__loading">
      <EmButtonLoader />
    </span>

    <EmButtonContent :class="loading && 'emerald-button__content--hidden'">
      <slot />
    </EmButtonContent>
  </V0Paper>
</template>

<style scoped>
.emerald-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--emerald-spacing-xs);
  padding: var(--emerald-spacing-xs) var(--emerald-spacing-s);
  border: var(--emerald-stroke-s) solid transparent;
  border-radius: var(--emerald-radius-m);
  font-family: var(--emerald-font-sans);
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
}

/* Sizes — shared padding/radius/gap; only typography and icon boxes scale */
.emerald-button[data-size="sm"] {
  font-size: var(--emerald-text-b3-size);
  line-height: var(--emerald-text-b3-height);
  font-weight: var(--emerald-text-b3-bold-weight);
}

.emerald-button[data-size="md"] {
  font-size: var(--emerald-text-b2-size);
  line-height: var(--emerald-text-b2-height);
  font-weight: var(--emerald-text-b2-bold-weight);
}

.emerald-button[data-size="lg"] {
  font-size: var(--emerald-text-b1-size);
  line-height: var(--emerald-text-b1-height);
  font-weight: var(--emerald-text-b1-bold-weight);
}

/* Icon boxes — spec fixes 18px (S) / 20px (M) / 24px (L) */
.emerald-button :deep(.emerald-button__prepend),
.emerald-button :deep(.emerald-button__append) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
}

.emerald-button[data-size="sm"] :deep(.emerald-button__prepend),
.emerald-button[data-size="sm"] :deep(.emerald-button__append) {
  width: var(--emerald-icon-s);
  height: var(--emerald-icon-s);
}

.emerald-button[data-size="md"] :deep(.emerald-button__prepend),
.emerald-button[data-size="md"] :deep(.emerald-button__append) {
  width: var(--emerald-icon-m);
  height: var(--emerald-icon-m);
}

.emerald-button[data-size="lg"] :deep(.emerald-button__prepend),
.emerald-button[data-size="lg"] :deep(.emerald-button__append) {
  width: var(--emerald-icon-l);
  height: var(--emerald-icon-l);
}

/* Primary — green fill */
.emerald-button[data-variant="primary"] {
  background: var(--emerald-primary-600);
  color: var(--emerald-on-primary);
}

.emerald-button[data-variant="primary"]:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-primary-700);
}

.emerald-button[data-variant="primary"]:active:not([data-disabled]) {
  background: var(--emerald-primary-800);
}

.emerald-button[data-variant="primary"][data-disabled] {
  background: var(--emerald-neutral-300);
}

.emerald-button[data-variant="primary"]:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-primary-600);
  outline-offset: 0;
}

/* Secondary — cyan outline, transparent fill */
.emerald-button[data-variant="secondary"] {
  background: transparent;
  border-color: var(--emerald-secondary-600);
  color: var(--emerald-secondary-600);
}

.emerald-button[data-variant="secondary"]:hover:not([data-disabled]):not(:active) {
  border-color: var(--emerald-secondary-700);
  color: var(--emerald-secondary-700);
}

.emerald-button[data-variant="secondary"]:active:not([data-disabled]) {
  border-color: var(--emerald-secondary-800);
  color: var(--emerald-secondary-800);
}

.emerald-button[data-variant="secondary"][data-disabled] {
  border-color: var(--emerald-neutral-400);
  color: var(--emerald-neutral-400);
}

.emerald-button[data-variant="secondary"]:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-secondary-600);
  outline-offset: 1px;
}

/* Tertiary ("Ghost") — borderless text button */
.emerald-button[data-variant="tertiary"] {
  background: transparent;
  color: var(--emerald-neutral-900);
}

.emerald-button[data-variant="tertiary"]:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-neutral-200);
}

.emerald-button[data-variant="tertiary"]:active:not([data-disabled]) {
  background: var(--emerald-neutral-300);
}

.emerald-button[data-variant="tertiary"][data-disabled] {
  color: var(--emerald-neutral-400);
}

.emerald-button[data-variant="tertiary"]:focus-visible {
  background: var(--emerald-neutral-200);
  box-shadow: inset 0 0 0 var(--emerald-stroke-l) var(--emerald-neutral-600);
  outline: none;
}

/* Destructive — red fill */
.emerald-button[data-variant="destructive"] {
  background: var(--emerald-danger-400);
  color: var(--emerald-on-danger);
}

.emerald-button[data-variant="destructive"]:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-danger-500);
}

.emerald-button[data-variant="destructive"]:active:not([data-disabled]) {
  background: var(--emerald-danger-600);
}

.emerald-button[data-variant="destructive"][data-disabled] {
  background: var(--emerald-neutral-300);
}

.emerald-button[data-variant="destructive"]:focus-visible {
  outline: var(--emerald-stroke-m) solid var(--emerald-danger-400);
  outline-offset: 0;
}

/* States */
.emerald-button[data-disabled] {
  cursor: not-allowed;
  pointer-events: none;
}

.emerald-button[data-loading] {
  position: relative;
  cursor: progress;
}

.emerald-button__content {
  display: inline-flex;
  align-items: center;
  gap: inherit;
}

.emerald-button__content--hidden {
  visibility: hidden;
}

.emerald-button__loading {
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
