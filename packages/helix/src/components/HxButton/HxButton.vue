<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
    href?: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxButton' })

  const {
    disabled = false,
    loading = false,
    type = 'button',
    href,
    variant = 'secondary',
    ...paperProps
  } = defineProps<HxButtonProps>()

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  function onClick (event: MouseEvent) {
    if (disabled || loading) return

    emit('click', event)
  }
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    :aria-busy="loading || undefined"
    :aria-disabled="(disabled || loading) || undefined"
    :as="href ? 'a' : 'button'"
    class="helix-button"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    :data-variant="variant"
    :disabled="(disabled || loading) || undefined"
    :href
    :type="href ? undefined : type"
    @click="onClick"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.helix-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  font: inherit;
  font-weight: 500;
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  transition: background-color 0.15s, border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
}

.helix-button[data-variant='primary'] {
  background-color: var(--v0-primary);
  color: var(--v0-on-primary);
}

.helix-button[data-variant='primary']:hover {
  filter: brightness(1.1);
}

.helix-button[data-variant='primary']:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

.helix-button[data-variant='secondary'] {
  background-color: transparent;
  border-color: var(--v0-divider);
  color: var(--v0-on-surface);
}

.helix-button[data-variant='secondary']:hover {
  border-color: var(--v0-primary);
  background-color: var(--v0-surface-tint);
}

.helix-button[data-variant='secondary']:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

.helix-button[data-variant='ghost'] {
  background-color: transparent;
  color: var(--v0-on-surface);
}

.helix-button[data-variant='ghost']:hover {
  background-color: var(--v0-surface-tint);
}

.helix-button[data-variant='ghost']:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

.helix-button[data-variant='icon'] {
  padding: 0.5rem;
  background-color: transparent;
  color: var(--v0-on-surface-variant);
  border-radius: 0.375rem;
}

.helix-button[data-variant='icon']:hover {
  background-color: var(--v0-surface-tint);
  color: var(--v0-on-surface);
}

.helix-button[data-variant='icon']:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: 2px;
}

.helix-button[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.helix-button[data-loading] {
  opacity: 0.7;
}
</style>
