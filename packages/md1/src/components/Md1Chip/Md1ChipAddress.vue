<script lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Chip } from './Md1Chip.vue'

  // Types
  import type { ButtonRootProps } from '@vuetify/v0'

  // Components
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  /** One address of the open contact chip: a 40 dp row at 14 sp. Pressing it closes the chip; the consumer's `@click` does the swap. */
  export interface Md1ChipAddressProps extends Pick<ButtonRootProps, 'disabled'> {
    /** The address the chip is using now: marked `aria-current`, set at Medium weight, and focused first when the chip opens. */
    active?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ChipAddress' })

  defineSlots<{
    /** The address text. */
    default?: () => any
  }>()

  const { active = false, disabled = false } = defineProps<Md1ChipAddressProps>()

  orphan('Md1ChipAddress', useMd1Chip())
</script>

<template>
  <Button.Root
    :aria-current="active ? 'true' : undefined"
    class="md1-chip__address"
    :data-active="active || undefined"
    :disabled
  >
    <Md1Ripple />

    <span class="md1-chip__address-text">
      <slot />
    </span>
  </Button.Root>
</template>

<style>
  /* "Address text, open: Roboto Regular 14sp" (chips page); the row height and the 72 dp keyline are the dense list's (decision, SPEC.md). */
  .md1-chip__address {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    height: 40px;
    margin: 0;
    padding: 0;
    padding-inline: var(--md1-keyline-content, 72px) var(--md1-spacing-2, 16px);
    border: 0;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 14px;
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 1;
    text-align: start;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  @media (hover: hover) {
    .md1-chip__address:hover {
      background-image: linear-gradient(var(--md1-hover, rgba(0, 0, 0, 0.06)), var(--md1-hover, rgba(0, 0, 0, 0.06)));
    }
  }

  .md1-chip__address:focus-visible {
    outline: 2px solid transparent;
    background-image: linear-gradient(var(--md1-focus, rgba(0, 0, 0, 0.12)), var(--md1-focus, rgba(0, 0, 0, 0.12)));
  }

  /*
   * The current address at Medium weight, Body 2's emphasis at the same size
   * (decision: the page shows the activated row only as an image). Not the
   * primary colour: Indigo 500 on the dark theme's Grey 800 sheet is 1.5:1.
   */
  .md1-chip__address[data-active] {
    font-weight: var(--md1-font-weight-medium, 500);
  }

  .md1-chip__address[data-disabled] {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
    pointer-events: none;
  }

  /* Above the ink layer. */
  .md1-chip__address-text {
    position: relative;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
