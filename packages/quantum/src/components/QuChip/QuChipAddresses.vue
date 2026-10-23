<script lang="ts">
  // Framework
  import { Popover, useId, useLogger, usePopoverContext } from '@vuetify/v0'

  // Context
  import { orphan, useQuChip } from './QuChip.vue'

  // Utilities
  import { nextTick, onBeforeUnmount, useTemplateRef, watch } from 'vue'

  // Types
  import type { QuChipContext } from './QuChip.vue'
  import type { PopoverContext } from '@vuetify/v0'

  /**
   * The open contact chip (chips page): an 8 dp sheet headed by the contact's
   * name at 16 sp, listing `Address` rows at 14 sp. No props: the name and
   * the avatar come from the chip, the rows are the default slot.
   */
  export interface QuChipAddressesProps {}

  /**
   * Over the chip it expands from, top-start corners aligned; the browser
   * flips it to the other side of the chip when the viewport runs out.
   */
  const TRY = 'flip-block, flip-inline, flip-block flip-inline'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuChipAddresses' })

  defineSlots<{
    /** The `QuChip.Address` rows, the current one marked `active`. */
    default?: () => any
  }>()

  defineProps<QuChipAddressesProps>()

  const context: QuChipContext | null = useQuChip()
  orphan('QuChipAddresses', context)

  if (__DEV__ && context && !context.contact.value) {
    useLogger().warn('[QuChipAddresses] needs <QuChip contact>: only the contact chip opens to its addresses (chips page)')
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
    const row = el?.querySelector<HTMLElement>('.quantum-chip__address[data-active]:not([data-disabled])')
      ?? el?.querySelector<HTMLElement>('.quantum-chip__address:not([data-disabled])')

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
      class="quantum-chip__addresses"
      position-area="none"
      :position-try="TRY"
      role="dialog"
      @click="onClick"
    >
      <div class="quantum-chip__addresses-header">
        <img
          v-if="context.avatar.value"
          alt=""
          class="quantum-chip__addresses-avatar"
          :src="context.avatar.value"
        >

        <span :id class="quantum-chip__addresses-name">{{ context.name.value }}</span>
      </div>

      <div ref="list" class="quantum-chip__addresses-list">
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
   * The adapter writes `position`, `position-anchor` and the fallbacks inline;
   * the insets put the sheet's top-start corner on the chip's, the "expands"
   * of the page, and `flip-block` moves it above the chip when there is no room.
   */
  .quantum-chip__addresses {
    inset: auto;
    top: anchor(top);
    inset-inline-start: anchor(start);
    box-sizing: border-box;
    min-width: 280px;
    max-width: calc(100vw - 32px);
    padding: 0;
    border: 0;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    overflow: visible;
    cursor: pointer;
  }

  /* The heading: the 40 dp avatar at the 16 dp keyline, the name at the 72 dp content keyline, as a list's avatar row. */
  .quantum-chip__addresses-header {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    min-height: 72px;
    padding: var(--quantum-spacing-2, 16px);
  }

  .quantum-chip__addresses-header:not(:has(> .quantum-chip__addresses-avatar)) {
    padding-inline-start: var(--quantum-keyline-content, 72px);
  }

  .quantum-chip__addresses-avatar {
    flex: none;
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    border-radius: 50%;
    object-fit: cover;
  }

  /* "Contact name text, open: Roboto Regular 16sp" (chips page); 24 dp leading, the Subheading rhythm. */
  .quantum-chip__addresses-name {
    min-width: 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: var(--quantum-font-weight-regular, 400);
    line-height: 24px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* The rows end 8 dp above the sheet's edge, the menu rhythm. */
  .quantum-chip__addresses-list {
    padding-block-end: var(--quantum-spacing-1, 8px);
  }
</style>
