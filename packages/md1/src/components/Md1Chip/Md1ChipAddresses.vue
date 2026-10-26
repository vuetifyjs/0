<script lang="ts">
  // Framework
  import { Popover, useId, useLogger, usePopoverContext } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Chip } from './Md1Chip.vue'

  // Utilities
  import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue'

  // Types
  import type { Md1ChipContext } from './Md1Chip.vue'
  import type { PopoverContext } from '@vuetify/v0'

  /**
   * The open contact chip (chips page): an 8 dp sheet headed by the contact's
   * name at 16 sp, listing `Address` rows at 14 sp. No props: the name and
   * the avatar come from the chip, the rows are the default slot.
   */
  export interface Md1ChipAddressesProps {}

  /**
   * Over the chip it expands from, its photo over the chip's. The browser
   * mirrors it over the chip when there is no room below, and pins its end
   * edge to the screen's margin when there is no room at the end.
   */
  const TRY = 'flip-block, --md1-chip-addresses-end, flip-block --md1-chip-addresses-end'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ChipAddresses' })

  defineSlots<{
    /** The `Md1Chip.Address` rows, the current one marked `active`. */
    default?: () => any
  }>()

  defineProps<Md1ChipAddressesProps>()

  const context: Md1ChipContext | null = useMd1Chip()
  orphan('Md1ChipAddresses', context)

  if (__DEV__ && context && !context.contact.value) {
    useLogger().warn('[Md1ChipAddresses] needs <Md1Chip contact>: only the contact chip opens to its addresses (chips page)')
  }

  // The chip renders the Popover.Root, so the part has one exactly when it has a chip.
  const popover: PopoverContext | null = context ? usePopoverContext() : null

  if (context) onBeforeUnmount(context.register())

  const id = useId()
  const list = useTemplateRef<HTMLElement>('list')

  // "The top field is activated and focused by default" (chips page): the
  // active row, else the first, takes focus when the sheet opens. A disabled
  // row cannot hold focus, so it is skipped. The native popover gives focus
  // back to the chip when it closes.
  function focus () {
    const el = list.value
    const row = el?.querySelector<HTMLElement>('.md1-chip__address[data-active]:not([data-disabled])')
      ?? el?.querySelector<HTMLElement>('.md1-chip__address:not([data-disabled])')

    row?.focus()
  }

  watch(() => popover?.isOpen.value, open => {
    if (open) nextTick(focus)
  })

  // "Pressing it closes it automatically": any press on the open chip, a row or the heading, closes it.
  function onClick () {
    popover?.close()
  }
</script>

<template>
  <!--
    Teleported out of the chip's <button>, which cannot hold it, into the
    outlet the chip renders beside itself, so a scoped theme still reaches the
    sheet. Deferred because the outlet mounts after the slot. Vue's Teleport
    rather than v0 Portal: the native popover paints in the top layer, so there
    is no stack to join.
  -->
  <Teleport
    v-if="context && context.contact.value"
    defer
    :to="`#${context.outlet}`"
  >
    <Popover.Content
      :aria-labelledby="id"
      class="md1-chip__addresses"
      position-area="none"
      :position-try="TRY"
      role="dialog"
      @click="onClick"
    >
      <div class="md1-chip__addresses-header">
        <img
          v-if="context.avatar.value"
          alt=""
          class="md1-chip__addresses-avatar"
          :src="context.avatar.value"
        >

        <span :id class="md1-chip__addresses-name">{{ context.name.value }}</span>
      </div>

      <div ref="list" class="md1-chip__addresses-list">
        <slot />
      </div>
    </Popover.Content>
  </Teleport>
</template>

<style>
  /*
   * The open contact chip rests at 8 dp (chips page) on the surface colour
   * with the 2 dp sheet radius. No `display` here: the UA keeps a closed
   * popover `display: none`, and overriding it would leave the sheet visible.
   * The adapter writes `position`, `position-anchor` and the fallbacks inline.
   * The insets put the heading's photo centre over the chip's, the "expands"
   * of the page: the chip's photo is a circle at its start edge as tall as the
   * chip, so its centre is half the chip's height in from the start and down
   * from the top, whether the chip rests at 32 dp or is focused at 40 dp.
   * `anchor(inside)` resolves against the sheet's own direction, so a subtree
   * set to RTL lines up too. `flip-block` mirrors the sheet over the chip when
   * there is no room below; the start inset never goes off screen.
   */
  .md1-chip__addresses {
    --md1-chip-addresses-block: calc(var(--md1-spacing-2, 16px) + var(--md1-avatar-size, 40px) / 2);
    --md1-chip-addresses-inline: calc(var(--md1-keyline-margin, 16px) + var(--md1-avatar-size, 40px) / 2);

    inset: auto;
    top: calc(anchor(center) - var(--md1-chip-addresses-block));
    inset-inline-start: max(0px, calc(anchor(inside) + anchor-size(block) / 2 - var(--md1-chip-addresses-inline)));
    box-sizing: border-box;
    min-width: 280px;
    max-width: calc(100vw - 32px);
    padding: 0;
    border: 0;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    overflow: visible;
    cursor: pointer;
  }

  /* No room at the end: the end edge on the screen's margin, the sheet still over the chip. */
  @position-try --md1-chip-addresses-end {
    inset-inline-start: auto;
    inset-inline-end: var(--md1-keyline-margin, 16px);
  }

  /*
   * The heading: the 40 dp avatar at the margin keyline, the name at the
   * content keyline (72 dp, 80 dp from 600 px) shared with the address rows,
   * as a list's avatar row.
   */
  .md1-chip__addresses-header {
    display: flex;
    align-items: center;
    gap: calc(var(--md1-keyline-content, 72px) - var(--md1-keyline-margin, 16px) - var(--md1-avatar-size, 40px));
    box-sizing: border-box;
    min-height: 72px;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
  }

  .md1-chip__addresses-header:not(:has(> .md1-chip__addresses-avatar)) {
    padding-inline-start: var(--md1-keyline-content, 72px);
  }

  .md1-chip__addresses-avatar {
    flex: none;
    width: var(--md1-avatar-size, 40px);
    height: var(--md1-avatar-size, 40px);
    border-radius: 50%;
    object-fit: cover;
  }

  /* "Contact name text, open: Roboto Regular 16sp" (chips page); 24 dp leading, the Subheading rhythm. */
  .md1-chip__addresses-name {
    min-width: 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: var(--md1-font-weight-regular, 400);
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The rows end 8 dp above the sheet's edge, the menu rhythm. */
  .md1-chip__addresses-list {
    padding-block-end: var(--md1-spacing-1, 8px);
  }
</style>
