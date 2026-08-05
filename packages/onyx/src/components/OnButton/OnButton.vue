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
    border: var(--onyx-stroke-s, 1px) solid transparent;
    border-radius: var(--onyx-radius-md, 0.375rem);
    cursor: pointer;
    display: inline-flex;
    font-family: var(--onyx-font-sans, ui-sans-serif, system-ui, sans-serif);
    font-size: var(--onyx-text-base-size, 15px);
    font-weight: 550;
    gap: var(--onyx-spacing-xs, 8px);
    justify-content: center;
    letter-spacing: var(--onyx-text-base-tracking, -0.003em);
    line-height: var(--onyx-text-base-height, 24px);
    padding: 0 var(--onyx-spacing-md, 16px);
    transition: background-color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                border-color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                box-shadow var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
    white-space: nowrap;
  }

  /* One focus treatment for the whole system — a real outline, never replaced by a box-shadow.
     Girdles/glows on individual variants are additive decoration on top of this, never a
     substitute (graft from Direction B §8: focus indication is a prohibition, not a preference). */
  .onyx-button:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  .onyx-button[data-size='sm'] { height: var(--onyx-control-sm, 32px); font-size: var(--onyx-text-sm-size, 13.5px); padding: 0 var(--onyx-spacing-sm, 12px); }
  .onyx-button[data-size='md'] { height: var(--onyx-control-md, 36px); }
  .onyx-button[data-size='lg'] { height: var(--onyx-control-lg, 40px); padding: 0 var(--onyx-spacing-lg, 24px); }
  .onyx-button[data-size='icon'] { height: var(--onyx-control-md, 36px); width: var(--onyx-control-md, 36px); padding: 0; }

  /* 1 — default: the metal. Champagne fill, pitch text — the one metal object in the case. */
  .onyx-button[data-variant='default'] {
    background: var(--onyx-band), var(--onyx-primary, #dac593);
    box-shadow: inset 0 1px 0 0 rgb(255 252 244 / 0.35), var(--onyx-pool);
    color: var(--onyx-primary-foreground, #0d0a08);
  }
  .onyx-button[data-variant='default']:hover:not([data-disabled]) {
    /* Mixes toward card, not foreground: in light mode primary IS foreground (the fill is the
       dark stone itself), so mixing toward foreground is a no-op there. card lightens in both
       themes and stays a subtler touch than the :active mix below. */
    background: var(--onyx-band), color-mix(in oklab, var(--onyx-primary, #dac593) 95%, var(--onyx-card, #181411));
  }
  .onyx-button[data-variant='default']:active:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-primary, #dac593) 88%, var(--onyx-card, #181411));
    box-shadow: var(--onyx-girdle-recess);
  }

  /* 2 — secondary: polished stone */
  .onyx-button[data-variant='secondary'] {
    background: var(--onyx-band), var(--onyx-secondary, #211c19);
    border-color: var(--onyx-border, #2f2925);
    box-shadow: var(--onyx-girdle);
    color: var(--onyx-secondary-foreground, #f0ece5);
  }
  .onyx-button[data-variant='secondary']:hover:not([data-disabled]) {
    background: var(--onyx-band), var(--onyx-accent, #2f2925);
    box-shadow: var(--onyx-girdle-lit);
  }

  /* 3 — outline: unlit until touched. Hover lights the edge — no fill change is needed. */
  .onyx-button[data-variant='outline'] {
    border-color: var(--onyx-input, #2f2925);
    color: var(--onyx-foreground, #f0ece5);
  }
  .onyx-button[data-variant='outline']:hover:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 55%, transparent);
    border-color: var(--onyx-hairline-strong, #423c37);
    box-shadow: var(--onyx-girdle);
  }

  /* 4 — ghost: not an object, so it never receives a girdle */
  .onyx-button[data-variant='ghost'] { color: var(--onyx-foreground, #f0ece5); }
  .onyx-button[data-variant='ghost']:hover:not([data-disabled]) {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
  }

  /* 5 — destructive: carnelian, the sardonyx band */
  .onyx-button[data-variant='destructive'] {
    background: var(--onyx-band), var(--onyx-destructive, #cf4b3b);
    box-shadow: inset 0 1px 0 0 rgb(255 236 230 / 0.20), var(--onyx-pool);
    color: var(--onyx-destructive-foreground, #f0ece5);
  }
  .onyx-button[data-variant='destructive']:hover:not([data-disabled]) {
    background: var(--onyx-band), color-mix(in oklab, var(--onyx-destructive, #cf4b3b) 90%, var(--onyx-foreground, #f0ece5));
  }

  /* 6 — link: champagne is allowed here because it is not a surface */
  .onyx-button[data-variant='link'] {
    color: var(--onyx-champagne, #dac593);
    height: auto;
    padding: 0;
    text-decoration-color: color-mix(in oklab, var(--onyx-champagne, #dac593) 40%, transparent);
    text-decoration-line: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
  }
  .onyx-button[data-variant='link']:hover:not([data-disabled]) {
    text-decoration-color: var(--onyx-champagne, #dac593);
  }

  /* Explicit disabled colors, never opacity — an opacity fade also dims the focus ring and drops
     text below the accessibility floor (graft from Direction B §8/§4: "disabled state sets an
     explicit color and never uses opacity: 0.5"). A disabled object doesn't catch light either,
     so no girdle/pool/band. */
  .onyx-button[data-disabled] {
    background: var(--onyx-card, #181411);
    border-color: var(--onyx-border, #2f2925);
    box-shadow: none;
    color: var(--onyx-muted-foreground, #bab3ab);
    pointer-events: none;
  }

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
