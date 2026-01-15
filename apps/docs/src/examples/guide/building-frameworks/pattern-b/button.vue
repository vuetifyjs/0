<script setup lang="ts">
  import type { AtomProps } from '@vuetify/v0'

  import { Atom } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  interface MyButtonProps extends AtomProps {
    variant?: 'filled' | 'outlined' | 'text'
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
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
          class="my-button my-button--text my-button--md my-button--primary"
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

    <!-- Color showcase -->
    <div>
      <p class="text-sm font-medium mb-2">Colors</p>
      <div class="flex flex-wrap gap-2">
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--primary">Primary</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--secondary">Secondary</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--success">Success</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--warning">Warning</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--error">Error</Atom>
        <Atom as="button" class="my-button my-button--filled my-button--md my-button--info">Info</Atom>
      </div>
    </div>
  </div>
</template>

<style>
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
  .my-button--filled.my-button--primary { background: var(--v0-primary); color: var(--v0-on-primary); }
  .my-button--filled.my-button--secondary { background: var(--v0-secondary); color: var(--v0-on-secondary); }
  .my-button--filled.my-button--success { background: var(--v0-success); color: var(--v0-on-success); }
  .my-button--filled.my-button--warning { background: var(--v0-warning); color: var(--v0-on-warning); }
  .my-button--filled.my-button--error { background: var(--v0-error); color: var(--v0-on-error); }
  .my-button--filled.my-button--info { background: var(--v0-info); color: var(--v0-on-info); }
  .my-button--filled:hover { opacity: 0.9; }

  /* Outlined variants */
  .my-button--outlined { background: transparent; }
  .my-button--outlined.my-button--primary { border-color: var(--v0-primary); color: var(--v0-primary); }
  .my-button--outlined.my-button--secondary { border-color: var(--v0-secondary); color: var(--v0-secondary); }
  .my-button--outlined.my-button--success { border-color: var(--v0-success); color: var(--v0-success); }
  .my-button--outlined.my-button--warning { border-color: var(--v0-warning); color: var(--v0-warning); }
  .my-button--outlined.my-button--error { border-color: var(--v0-error); color: var(--v0-error); }
  .my-button--outlined.my-button--info { border-color: var(--v0-info); color: var(--v0-info); }
  .my-button--outlined:hover { background: rgba(0, 0, 0, 0.05); }

  /* Text variants */
  .my-button--text { background: transparent; border-color: transparent; }
  .my-button--text.my-button--primary { color: var(--v0-primary); }
  .my-button--text.my-button--secondary { color: var(--v0-secondary); }
  .my-button--text.my-button--success { color: var(--v0-success); }
  .my-button--text.my-button--warning { color: var(--v0-warning); }
  .my-button--text.my-button--error { color: var(--v0-error); }
  .my-button--text.my-button--info { color: var(--v0-info); }
  .my-button--text:hover { background: rgba(0, 0, 0, 0.05); }
</style>
