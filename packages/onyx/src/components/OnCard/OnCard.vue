<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export interface OnCardProps {
    /** Card is a clickable/hoverable surface — lights its girdle on hover instead of moving. */
    interactive?: boolean
    /** Card is the current selection — girdle takes the champagne accent. */
    selected?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnCard' })

  const { interactive = false, selected = false } = defineProps<OnCardProps>()
</script>

<template>
  <Atom as="div" class="onyx-card" :data-interactive="interactive || undefined" :data-selected="selected || undefined">
    <slot />
  </Atom>
</template>

<!-- Unscoped: this file's family CSS also styles OnCardHeader/Title/Description/Content/Footer's
     Atom roots, rendered in sibling SFCs outside this file's scope id — scoped data-v never
     reaches them. -->
<style>
  .onyx-card {
    background: var(--onyx-band), var(--onyx-card, #181411);
    border: var(--onyx-stroke-s, 1px) solid var(--onyx-border, #2f2925);
    border-radius: var(--onyx-radius-lg, 0.5rem);
    box-shadow: var(--onyx-girdle), var(--onyx-pool);
    color: var(--onyx-card-foreground, #f0ece5);
    transition: box-shadow var(--onyx-motion-base, 200ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1)),
                border-color var(--onyx-motion-base, 200ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Interactive cards only. The card does not move — the light on it changes. */
  .onyx-card[data-interactive]:hover {
    border-color: var(--onyx-hairline-strong, #423c37);
    box-shadow: var(--onyx-girdle-lit), var(--onyx-pool);
  }

  .onyx-card[data-selected] {
    border-color: color-mix(in oklab, var(--onyx-champagne, #dac593) 30%, var(--onyx-border, #2f2925));
    box-shadow: var(--onyx-girdle-active), var(--onyx-pool);
  }

  .onyx-card__header {
    display: flex;
    flex-direction: column;
    gap: var(--onyx-spacing-2xs, 4px);
    padding: var(--onyx-spacing-xl, 32px) var(--onyx-spacing-xl, 32px) var(--onyx-spacing-md, 16px);
  }

  .onyx-card__title {
    font-size: var(--onyx-text-md-size, 16.5px);
    font-weight: 550;
    letter-spacing: var(--onyx-text-md-tracking, -0.005em);
    line-height: var(--onyx-text-md-height, 27px);
  }

  .onyx-card__description {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-size: var(--onyx-text-sm-size, 13.5px);
    line-height: var(--onyx-text-sm-height, 22px);
  }

  .onyx-card__content {
    padding: 0 var(--onyx-spacing-xl, 32px) var(--onyx-spacing-xl, 32px);
  }

  .onyx-card__footer {
    align-items: center;
    display: flex;
    gap: var(--onyx-spacing-sm, 12px);
    padding: 0 var(--onyx-spacing-xl, 32px) var(--onyx-spacing-xl, 32px);
  }
</style>
