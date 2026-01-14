<script lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  export interface MyButtonProps extends AtomProps {
    variant?: 'filled' | 'outlined' | 'text'
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'neutral'
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '@vuetify/v0'
  // Utilities
  import { toRef } from 'vue'

  const {
    as = 'button',
    variant = 'filled',
    size = 'md',
    color = 'primary',
    disabled,
  } = defineProps<MyButtonProps>()

  const classes = toRef(() => [
    'my-button',
    `my-button--${variant}`,
    `my-button--${size}`,
    `my-button--${color}`,
    { 'my-button--disabled': disabled },
  ])
</script>

<template>
  <Atom
    :as="as"
    :class="classes"
    :disabled="disabled"
  >
    <slot />
  </Atom>
</template>

<style>
.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 150ms;
}

.my-button:focus-visible {
  outline: 2px solid var(--v0-color-primary);
  outline-offset: 2px;
}

/* Sizes */
.my-button--sm { padding: 0.375rem 0.75rem; font-size: 0.75rem; }
.my-button--md { padding: 0.5rem 1rem; font-size: 0.875rem; }
.my-button--lg { padding: 0.75rem 1.5rem; font-size: 1rem; }

/* Filled */
.my-button--filled.my-button--primary {
  background: var(--v0-color-primary);
  color: var(--v0-color-on-primary);
}
.my-button--filled.my-button--neutral {
  background: var(--v0-color-surface-variant);
  color: var(--v0-color-on-surface);
}
.my-button--filled:hover:not(:disabled) { opacity: 0.9; }

/* Outlined */
.my-button--outlined {
  background: transparent;
}
.my-button--outlined.my-button--primary {
  border-color: var(--v0-color-primary);
  color: var(--v0-color-primary);
}
.my-button--outlined.my-button--neutral {
  border-color: var(--v0-color-divider);
  color: var(--v0-color-on-surface);
}
.my-button--outlined:hover:not(:disabled) {
  background: var(--v0-color-surface-variant);
}

/* Text */
.my-button--text {
  background: transparent;
}
.my-button--text.my-button--primary { color: var(--v0-color-primary); }
.my-button--text.my-button--neutral { color: var(--v0-color-on-surface); }
.my-button--text:hover:not(:disabled) {
  background: var(--v0-color-surface-variant);
}

/* Disabled */
.my-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
