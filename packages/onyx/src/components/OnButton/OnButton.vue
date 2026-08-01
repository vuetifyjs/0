<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Utilities
  import { useAttrs } from 'vue'

  export type OnButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'
  export type OnButtonSize = 'sm' | 'md' | 'lg' | 'icon'

  export interface OnButtonProps {
    ariaLabel?: string
    disabled?: boolean
    loading?: boolean
    size?: OnButtonSize
    variant?: OnButtonVariant
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnButton', inheritAttrs: false })

  const attrs = useAttrs()

  const { ariaLabel, disabled = false, loading = false, size = 'md', variant = 'default' } = defineProps<OnButtonProps>()
</script>

<template>
  <Button.Root
    v-bind="attrs"
    :aria-label
    class="onyx-button"
    :data-size="size"
    :data-variant="variant"
    :disabled
    :loading
  >
    <Button.Loading>
      <span aria-hidden="true" class="onyx-button__spinner" />
    </Button.Loading>

    <Button.Content class="onyx-button__content">
      <slot />
    </Button.Content>
  </Button.Root>
</template>

<!-- Unscoped: Button.Root is multi-root; scoped data-v never lands on the button element. -->
<style>
  .onyx-button {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-md, 0.375rem);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--onyx-font-sans, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--onyx-text-base-size, 14px);
    font-weight: 500;
    gap: var(--onyx-spacing-xs, 8px);
    justify-content: center;
    line-height: var(--onyx-text-base-height, 20px);
    padding: 0 var(--onyx-spacing-md, 16px);
    transition: background-color var(--onyx-motion-fast, 120ms), color var(--onyx-motion-fast, 120ms), border-color var(--onyx-motion-fast, 120ms);
    white-space: nowrap;
  }

  .onyx-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--onyx-ring, #71717a) 50%, transparent);
  }

  .onyx-button[data-disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  .onyx-button[data-size='sm'] { height: var(--onyx-control-sm, 32px); font-size: var(--onyx-text-sm-size, 13px); padding: 0 var(--onyx-spacing-sm, 12px); }
  .onyx-button[data-size='md'] { height: var(--onyx-control-md, 36px); }
  .onyx-button[data-size='lg'] { height: var(--onyx-control-lg, 40px); padding: 0 var(--onyx-spacing-lg, 24px); }
  .onyx-button[data-size='icon'] { height: var(--onyx-control-md, 36px); width: var(--onyx-control-md, 36px); padding: 0; }

  .onyx-button[data-variant='default'] { background: var(--onyx-primary, #fafafa); color: var(--onyx-primary-foreground, #18181b); }
  .onyx-button[data-variant='default']:hover:not([data-disabled]) { background: color-mix(in srgb, var(--onyx-primary, #fafafa) 90%, transparent); }
  .onyx-button[data-variant='secondary'] { background: var(--onyx-secondary, #27272a); color: var(--onyx-secondary-foreground, #fafafa); }
  .onyx-button[data-variant='secondary']:hover:not([data-disabled]) { background: color-mix(in srgb, var(--onyx-secondary, #27272a) 80%, transparent); }
  .onyx-button[data-variant='outline'] { background: var(--onyx-background, #09090b); border: var(--onyx-stroke-s, 1px) solid var(--onyx-input, #27272a); color: var(--onyx-foreground, #fafafa); }
  .onyx-button[data-variant='outline']:hover:not([data-disabled]) { background: var(--onyx-accent, #27272a); color: var(--onyx-accent-foreground, #fafafa); }
  .onyx-button[data-variant='ghost'] { color: var(--onyx-foreground, #fafafa); }
  .onyx-button[data-variant='ghost']:hover:not([data-disabled]) { background: var(--onyx-accent, #27272a); color: var(--onyx-accent-foreground, #fafafa); }
  .onyx-button[data-variant='destructive'] { background: var(--onyx-destructive, #ef4444); color: var(--onyx-destructive-foreground, #ffffff); }
  .onyx-button[data-variant='destructive']:hover:not([data-disabled]) { background: color-mix(in srgb, var(--onyx-destructive, #ef4444) 90%, transparent); }
  .onyx-button[data-variant='link'] { color: var(--onyx-primary, #fafafa); text-decoration-line: underline; text-underline-offset: 4px; padding: 0; height: auto; }

  .onyx-button__spinner {
    animation: onyx-spin 0.8s linear infinite;
    border: var(--onyx-stroke-m, 2px) solid currentcolor;
    border-radius: 9999px;
    border-top-color: transparent;
    display: inline-block;
    height: 14px;
    width: 14px;
  }

  @keyframes onyx-spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    .onyx-button { transition: none; }
    .onyx-button__spinner { animation-duration: 2s; }
  }
</style>
