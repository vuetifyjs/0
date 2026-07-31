<script setup lang="ts">
  export interface AppCloseButtonProps {
    size?: 'sm' | 'md'
    label?: string
  }

  const {
    size = 'md',
    label = 'Close',
  } = defineProps<AppCloseButtonProps>()

  defineEmits<{
    click: [e: MouseEvent]
  }>()

  const sizes = {
    sm: { button: 20, icon: 12 },
    md: { button: 24, icon: 14 },
  }
</script>

<template>
  <AppTooltip
    :aria-label="label"
    class="close-button"
    :style="{
      width: `${sizes[size].button}px`,
      height: `${sizes[size].button}px`,
    }"
    :text="label"
    @click="$emit('click', $event)"
  >
    <svg
      aria-hidden="true"
      fill="none"
      :height="sizes[size].icon"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
      :width="sizes[size].icon"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  </AppTooltip>
</template>

<!-- Unscoped: AppTooltip renders a multi-root fragment, so the parent scope-id
     is not forwarded to its rendered <button>; a scoped .close-button selector
     would not match. See scoped-css-multiroot-child (#359). -->
<style>
.close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  border: none;
  border-radius: 4px;
  color: var(--v0-on-surface-variant);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s;
}

.close-button:hover {
  opacity: 1;
  background: var(--v0-surface-variant);
}

.close-button:focus-visible {
  opacity: 1;
  outline: 2px solid var(--v0-primary);
  outline-offset: 1px;
}
</style>
