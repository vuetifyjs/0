<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export type EmButtonSize = 'sm' | 'md' | 'lg'

  export interface EmButtonProps extends V0PaperProps {
    disabled?: boolean
    loading?: boolean
    size?: EmButtonSize
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
    type = 'button',
    href,
    ...paperProps
  } = defineProps<EmButtonProps>()

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
    class="emerald-button"
    :data-disabled="(disabled || loading) || undefined"
    :data-loading="loading || undefined"
    :data-size="size"
    :disabled="(disabled || loading) || undefined"
    :href
    :type="href ? undefined : type"
    @click="onClick"
  >
    <slot />
  </V0Paper>
</template>

<style scoped>
.emerald-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  border: none;
  cursor: pointer;
  user-select: none;
  background: var(--emerald-primary-500);
  color: var(--emerald-primary-100);
  transition: background-color 120ms ease, box-shadow 120ms ease, transform 80ms ease;
}

.emerald-button[data-size="sm"] {
  padding: 4.5px 9px;
  border-radius: 3px;
  font-size: 10.5px;
  line-height: 15px;
  gap: 6px;
}

.emerald-button[data-size="md"] {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;
}

.emerald-button[data-size="lg"] {
  padding: 7.5px 15px;
  border-radius: 5px;
  font-size: 17.5px;
  line-height: 25px;
  gap: 10px;
}

.emerald-button:hover:not([data-disabled]):not(:active) {
  background: var(--emerald-primary-700);
  color: var(--emerald-primary-200);
  box-shadow:
    0 1px 3px 0 var(--emerald-primary-700),
    0 1px 5px 0 rgb(var(--emerald-primary-700-channels) / 0.2);
}

.emerald-button:active:not([data-disabled]) {
  background: var(--emerald-primary-900);
  color: var(--emerald-primary-100);
  transform: scale(0.95);
  box-shadow: none;
}

.emerald-button:focus-visible {
  outline: 2px solid var(--emerald-primary-500);
  outline-offset: 2px;
}

.emerald-button[data-disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
