<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  export type OnDialogContentMode = 'default' | 'sheet'

  export interface OnDialogContentProps {
    blocking?: boolean
    closeOnClickOutside?: boolean
    mode?: OnDialogContentMode
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnDialogContent' })

  const {
    blocking,
    closeOnClickOutside,
    mode = 'default',
  } = defineProps<OnDialogContentProps>()
</script>

<template>
  <Dialog.Content
    :blocking
    class="onyx-dialog__content"
    :close-on-click-outside
    :data-mode="mode"
  >
    <slot />
  </Dialog.Content>
</template>

<!-- Unscoped: Dialog.Content is a compound child from v0's own file scope; scoped
     data-v never reaches its root (mirrors the OnButton/Button.Root case). -->
<style>
  .onyx-dialog__content {
    background: var(--onyx-band), var(--onyx-popover, #211c19);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-hairline-strong, #423c37);
    border-radius: var(--onyx-radius-xl, 0.75rem);
    box-shadow: var(--onyx-girdle-lit), var(--onyx-pool-overlay);
    color: var(--onyx-popover-foreground, #f0ece5);
    margin: auto;
    max-width: 512px;
    padding: var(--onyx-spacing-xl, 32px);
    width: 100%;
  }

  .onyx-dialog__content[open] {
    animation: onyx-present var(--onyx-motion-slow, 320ms) var(--onyx-motion-easing, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .onyx-dialog__content[open]::backdrop {
    animation: onyx-fade var(--onyx-motion-slow, 320ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Transforms dropped entirely, only opacity remains at 120ms (direction-a.md §7) — the
     entrance keeps its opacity fade but loses the rise/scale, and moves to the fast duration. */
  @media (prefers-reduced-motion: reduce) {
    .onyx-dialog__content[open] {
      animation: onyx-fade var(--onyx-motion-fast, 120ms) linear;
    }

    .onyx-dialog__content[open]::backdrop {
      animation: onyx-fade var(--onyx-motion-fast, 120ms) linear;
    }
  }

  @keyframes onyx-present {
    from { opacity: 0; transform: translateY(8px) scale(0.985); }
    to { opacity: 1; transform: none; }
  }

  @keyframes onyx-fade {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* No `position` override here: a modal <dialog> is already `position: fixed` via
     the UA stylesheet, which already establishes the containing block the close
     button's `position: absolute` needs. Setting `position: relative` here would
     beat that UA rule (author origin always wins, regardless of specificity) and
     break the dialog's viewport-relative centering. */

  /* [open] scoping is load-bearing: an unconditional `display` here would beat the
     UA's `dialog:not([open]) { display: none }` rule (author origin always wins
     over UA origin, regardless of specificity), leaving the dialog visible even
     while closed. */
  .onyx-dialog__content[open] {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-md, 16px);
  }

  /* Warm-black scrim with a light desaturation — never rgb(0 0 0 / X); a cool-black backdrop
     next to the warm ground would read as a rendering bug (direction-a.md §5.6, §3.2). */
  .onyx-dialog__content::backdrop {
    backdrop-filter: blur(3px) saturate(0.85);
    background: color-mix(in oklab, var(--onyx-pitch-deep, #080605) 78%, transparent);
  }

  .onyx-dialog__content[data-mode='sheet'] {
    margin: var(--onyx-spacing-3xl, 64px) auto auto;
  }

  @media (max-width: 768px) {
    .onyx-dialog__content[data-mode='sheet'] {
      border-radius: var(--onyx-radius-lg, 0.5rem) var(--onyx-radius-lg, 0.5rem) 0 0;
      bottom: 0;
      left: 0;
      margin: 0;
      max-width: 100%;
      position: fixed;
      right: 0;
      top: auto;
      width: 100%;
    }
  }
</style>
