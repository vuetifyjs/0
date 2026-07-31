<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export type EmDividerOrientation = 'horizontal' | 'vertical'

  export interface EmDividerProps {
    orientation?: EmDividerOrientation
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmDivider' })

  const {
    orientation = 'horizontal',
  } = defineProps<EmDividerProps>()
</script>

<template>
  <Atom
    v-if="$slots.default"
    :aria-orientation="orientation"
    as="div"
    class="emerald-divider"
    data-labeled
    :data-orientation="orientation"
    role="separator"
  >
    <span aria-hidden="true" class="emerald-divider__line" />

    <span class="emerald-divider__label">
      <slot />
    </span>

    <span aria-hidden="true" class="emerald-divider__line" />
  </Atom>

  <Atom
    v-else
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
    :as="orientation === 'vertical' ? 'div' : 'hr'"
    class="emerald-divider"
    :data-orientation="orientation"
    :role="orientation === 'vertical' ? 'separator' : undefined"
  />
</template>

<style>
  .emerald-divider {
    box-sizing: border-box;
    border: 0;
    margin: 0;
    flex-shrink: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
  }

  .emerald-divider[data-orientation='horizontal']:not([data-labeled]) {
    display: block;
    width: 100%;
    height: 0;
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
  }

  .emerald-divider[data-orientation='vertical']:not([data-labeled]) {
    display: inline-block;
    align-self: stretch;
    width: 0;
    min-height: 1em;
    height: 100%;
    border-left: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
  }

  .emerald-divider[data-labeled] {
    display: flex;
    align-items: center;
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
  }

  .emerald-divider[data-labeled][data-orientation='vertical'] {
    flex-direction: column;
    width: auto;
    height: 100%;
    min-height: 4em;
  }

  .emerald-divider__line {
    flex: 1 1 auto;
    min-width: var(--emerald-spacing-s, 12px);
    min-height: var(--emerald-spacing-s, 12px);
    border: 0;
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
  }

  .emerald-divider[data-orientation='vertical'] .emerald-divider__line {
    border-top: 0;
    border-left: var(--emerald-stroke-s, 1px) solid var(--emerald-divider, #ccd6e7);
    width: 0;
    min-width: 0;
  }

  .emerald-divider__label {
    flex: 0 0 auto;
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: var(--emerald-text-b3-weight, 400);
    line-height: var(--emerald-text-b3-height, 18px);
    color: var(--emerald-on-surface-variant, #757e85);
    white-space: nowrap;
  }
</style>
