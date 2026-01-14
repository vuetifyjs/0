<script setup lang="ts">
  // Types
  import type { AtomProps } from '@vuetify/v0'

  // Components
  import { Atom } from '@vuetify/v0'
  // Utilities
  import { shallowRef, toRef } from 'vue'

  interface MyButtonProps extends AtomProps {
    variant?: 'filled' | 'outlined' | 'text'
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'error'
  }

  const {
    as = 'button',
    variant = 'filled',
    size = 'md',
    color = 'primary',
  } = defineProps<MyButtonProps>()

  const classes = toRef(() => [
    'my-button',
    `my-button--${variant}`,
    `my-button--${size}`,
    `my-button--${color}`,
  ])

  // Demo state
  const clicks = shallowRef(0)
</script>

<template>
  <div class="space-y-6">
    <!-- Component definition preview -->
    <div class="p-4 bg-surface-variant rounded-lg">
      <p class="text-xs text-on-surface-variant mb-3 font-mono">MyButton.vue</p>
      <div class="flex flex-wrap gap-3">
        <Atom
          :as="as"
          :class="classes"
          @click="clicks++"
        >
          Click me ({{ clicks }})
        </Atom>

        <Atom
          as="a"
          class="my-button my-button--outlined my-button--md my-button--secondary"
          href="#"
          @click.prevent
        >
          Link Button
        </Atom>

        <Atom
          as="button"
          class="my-button my-button--text my-button--md my-button--error"
        >
          Delete
        </Atom>
      </div>
    </div>

    <!-- Variant showcase -->
    <div>
      <p class="text-sm font-medium mb-2">Variants</p>
      <div class="flex flex-wrap gap-2">
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--primary">Filled</Atom>
        <Atom as="button" class="my-button my-button--outlined my-button--md my-button--primary">Outlined</Atom>
        <Atom as="button" class="my-button my-button--text my-button--md my-button--primary">Text</Atom>
      </div>
    </div>

    <!-- Size showcase -->
    <div>
      <p class="text-sm font-medium mb-2">Sizes</p>
      <div class="flex flex-wrap items-center gap-2">
        <Atom as="button" class="my-button my-button--filled my-button--sm my-button--primary">Small</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--primary">Medium</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--lg my-button--primary">Large</Atom>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 150ms;
  cursor: pointer;
  border: 1px solid transparent;
}

/* Sizes */
.my-button--sm { padding: 0.25rem 0.75rem; font-size: 0.75rem; }
.my-button--md { padding: 0.5rem 1rem; font-size: 0.875rem; }
.my-button--lg { padding: 0.75rem 1.5rem; font-size: 1rem; }

/* Filled variants */
.my-button--filled.my-button--primary {
  background: var(--v0-color-primary);
  color: var(--v0-color-on-primary);
}
.my-button--filled.my-button--secondary {
  background: var(--v0-color-secondary);
  color: var(--v0-color-on-secondary);
}
.my-button--filled.my-button--error {
  background: var(--v0-color-error);
  color: var(--v0-color-on-error);
}
.my-button--filled:hover { opacity: 0.9; }

/* Outlined variants */
.my-button--outlined {
  background: transparent;
}
.my-button--outlined.my-button--primary {
  border-color: var(--v0-color-primary);
  color: var(--v0-color-primary);
}
.my-button--outlined.my-button--secondary {
  border-color: var(--v0-color-secondary);
  color: var(--v0-color-secondary);
}
.my-button--outlined.my-button--error {
  border-color: var(--v0-color-error);
  color: var(--v0-color-error);
}
.my-button--outlined:hover { background: rgba(0, 0, 0, 0.05); }

/* Text variants */
.my-button--text {
  background: transparent;
  border-color: transparent;
}
.my-button--text.my-button--primary { color: var(--v0-color-primary); }
.my-button--text.my-button--secondary { color: var(--v0-color-secondary); }
.my-button--text.my-button--error { color: var(--v0-color-error); }
.my-button--text:hover { background: rgba(0, 0, 0, 0.05); }
</style>
