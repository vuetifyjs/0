<script lang="ts">
  // Framework
  import { ExpansionPanel, isString, useExpansionPanelRoot } from '@vuetify/v0'

  // Utilities
  import { toRef, useSlots } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuExpansionPanelHeaderProps {
    /** The list content: Regular 15 sp (16 sp on handsets) at 87%, and the panel's accessible name. */
    label: string
    /** The middle column: the current value, in secondary ink at the label's size. The default slot replaces it. */
    summary?: string
    /** The 12 sp line under the label at 54%: "Optional", a hint, a count. */
    secondary?: string
    /** The v0 context key; set it only when two expansion panels nest. */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuExpansionPanelHeader' })

  defineSlots<{
    /** The summary column when a string is not enough: two labelled values side by side, a chip, a date. */
    default?: () => any
  }>()

  const { label, summary, secondary, namespace = 'v0:expansion-panel' } = defineProps<QuExpansionPanelHeaderProps>()

  const slots = useSlots()

  // Throws outside an Item, as v0's own parts do: a header is nothing without a ticket.
  const item = useExpansionPanelRoot(namespace)

  const open = toRef(() => item.ticket.isSelected.value)
  const valued = toRef(() => isString(summary) || !!slots.default)
</script>

<template>
  <ExpansionPanel.Header class="quantum-expansion-panel__heading" :namespace>
    <ExpansionPanel.Activator
      class="quantum-expansion-panel__header"
      :data-state="open ? 'open' : 'closed'"
      :namespace
    >
      <QuRipple />

      <span class="quantum-expansion-panel__text">
        <span class="quantum-expansion-panel__label">{{ label }}</span>

        <span v-if="secondary" class="quantum-expansion-panel__secondary">{{ secondary }}</span>
      </span>

      <span v-if="valued" class="quantum-expansion-panel__summary">
        <slot>{{ summary }}</slot>
      </span>

      <ExpansionPanel.Cue class="quantum-expansion-panel__cue" :namespace>
        <QuIcon name="expand-more" />
      </ExpansionPanel.Cue>
    </ExpansionPanel.Activator>
  </ExpansionPanel.Header>
</template>

<!-- Unscoped: the heading and the activator render through Atom; a scoped data-v never lands on them. -->
<style>
  /* The APG heading wrapper: a document-outline hook, no type of its own. */
  .quantum-expansion-panel__heading {
    margin: 0;
    border-radius: inherit;
    font: inherit;
  }

  /*
   * The row: 48 dp collapsed, 24 dp side padding, the label column, the value
   * column 16 dp after it, the 24 dp icon 16 dp after that and 24 dp from the
   * edge (figure spec2). 12 dp of vertical padding around a 24 dp text line
   * is the 48 dp; a second line grows the row to 64 dp, the two-line row of
   * the usage figure. Handsets stack the columns (the page gives no handset
   * layout; a decision): the value drops under the label.
   */
  .quantum-expansion-panel__header {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--quantum-icon-size, 24px);
    column-gap: var(--quantum-spacing-2, 16px);
    /* Centre the rows as one block: stretched auto rows would split the 64 dp header's free space and drop the glyph off the label's line. */
    align-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    margin: 0;
    padding: 12px var(--quantum-spacing-3, 24px);
    border: 0;
    border-radius: inherit;
    background: transparent;
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    text-align: start;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      min-height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Expanded: the header grows to 64 dp (figure spec2), the text staying centred. */
  .quantum-expansion-panel__header[data-state='open'] {
    min-height: 64px;
  }

  /*
   * Focus: Grey 200 on the focused list item (expansion-panels page), for
   * keyboard focus only. Grey 200 (#EEEEEE) is the white sheet shaded by 1/15
   * of opaque black, so the fill mixes 6.667% of the theme's ink, at full
   * strength through its channels, into the surface: exactly Grey 200 on the
   * light sheet, and the same share of white over Grey 800 on the dark one,
   * where the page states no value. The outline is transparent so nothing
   * paints beside the fill, solid so forced colours still draw a ring, and
   * inset so the sheet's clip keeps it.
   */
  .quantum-expansion-panel__header:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
    background-color: color-mix(in srgb, rgb(var(--quantum-text-primary-channels, 0 0 0)) 6.667%, var(--quantum-surface, #FFFFFF));
  }

  /* Disabled: the page states nothing; the ink drops to the disabled tier and the row answers to nothing. */
  .quantum-expansion-panel__header[data-disabled] {
    cursor: default;
    pointer-events: none;
  }

  /* Positioned so the text paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .quantum-expansion-panel__text,
  .quantum-expansion-panel__summary,
  .quantum-expansion-panel__cue {
    position: relative;
    min-width: 0;
  }

  .quantum-expansion-panel__text {
    display: flex;
    flex-direction: column;
    grid-column: 1;
  }

  /* The label: Subheading, Regular 15 sp on desktop and 16 sp on handsets, 87% (the type token carries the switch). */
  .quantum-expansion-panel__label {
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Secondary content: Caption, Regular 12 sp at 54%; 16 px of leading makes the two-line row 64 dp. */
  .quantum-expansion-panel__secondary {
    font-size: var(--quantum-type-caption-size, 12px);
    font-weight: var(--quantum-type-caption-weight, 400);
    line-height: 16px;
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The value column: the figures draw values in secondary grey at about the label's size (the page states neither). */
  .quantum-expansion-panel__summary {
    grid-column: 1;
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * The expand icon: 24 dp, 38% black at rest, 54% on hover and press
   * (expansion-panels page), pointing down collapsed and up expanded. In the
   * last column across every row of the header.
   */
  .quantum-expansion-panel__cue {
    display: inline-flex;
    grid-column: -2;
    /* Two rows on handsets, where the value drops under the label; the glyph centres across both. */
    grid-row: 1 / span 2;
    align-self: center;
    color: var(--quantum-icon-inactive, rgba(0, 0, 0, 0.38));
    transition:
      transform var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .quantum-expansion-panel__cue[data-state='open'] {
    transform: rotate(180deg);
  }

  .quantum-expansion-panel__header:hover .quantum-expansion-panel__cue,
  .quantum-expansion-panel__header:active .quantum-expansion-panel__cue {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }

  .quantum-expansion-panel__header[data-disabled] .quantum-expansion-panel__label,
  .quantum-expansion-panel__header[data-disabled] .quantum-expansion-panel__secondary,
  .quantum-expansion-panel__header[data-disabled] .quantum-expansion-panel__summary,
  .quantum-expansion-panel__header[data-disabled] .quantum-expansion-panel__cue {
    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* From the tablet breakpoint (layout/responsive-ui), the label and the value sit in two columns, one third to two thirds (a decision; the figures hold a fixed label column). */
  @media (min-width: 600px) {
    .quantum-expansion-panel__header {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) var(--quantum-icon-size, 24px);
    }

    .quantum-expansion-panel__summary {
      grid-column: 2;
    }

    /* Without a value column the label runs up to the icon. */
    .quantum-expansion-panel__text:has(+ .quantum-expansion-panel__cue) {
      grid-column: 1 / 3;
    }
  }

  /* Reduced motion: the row grows and the icon turns in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-expansion-panel__header,
  body[data-reduced-motion='reduce'] .quantum-expansion-panel__cue {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-expansion-panel__header,
    body:not([data-reduced-motion='no-preference']) .quantum-expansion-panel__cue {
      transition: none;
    }
  }
</style>
