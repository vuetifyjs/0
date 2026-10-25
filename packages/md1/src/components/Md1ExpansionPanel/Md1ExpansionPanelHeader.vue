<script lang="ts">
  // Framework
  import { ExpansionPanel, isString, useExpansionPanelRoot } from '@vuetify/v0'

  // Utilities
  import { toRef, useSlots } from 'vue'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1ExpansionPanelHeaderProps {
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
  defineOptions({ name: 'Md1ExpansionPanelHeader' })

  defineSlots<{
    /** The summary column when a string is not enough: two labelled values side by side, a chip, a date. */
    default?: () => any
  }>()

  const { label, summary, secondary, namespace = 'v0:expansion-panel' } = defineProps<Md1ExpansionPanelHeaderProps>()

  const slots = useSlots()

  // Throws outside an Item, as v0's own parts do: a header is nothing without a ticket.
  const item = useExpansionPanelRoot(namespace)

  const open = toRef(() => item.ticket.isSelected.value)
  const valued = toRef(() => isString(summary) || !!slots.default)
</script>

<template>
  <ExpansionPanel.Header class="md1-expansion-panel__heading" :namespace>
    <ExpansionPanel.Activator
      class="md1-expansion-panel__header"
      :data-state="open ? 'open' : 'closed'"
      :namespace
    >
      <Md1Ripple />

      <span class="md1-expansion-panel__text">
        <span class="md1-expansion-panel__label">{{ label }}</span>

        <span v-if="secondary" class="md1-expansion-panel__secondary">{{ secondary }}</span>
      </span>

      <span v-if="valued" class="md1-expansion-panel__summary">
        <slot>{{ summary }}</slot>
      </span>

      <ExpansionPanel.Cue class="md1-expansion-panel__cue" :namespace>
        <Md1Icon name="expand-more" />
      </ExpansionPanel.Cue>
    </ExpansionPanel.Activator>
  </ExpansionPanel.Header>
</template>

<!-- Unscoped: the heading and the activator render through Atom; a scoped data-v never lands on them. -->
<style>
  /* The APG heading wrapper: a document-outline hook, no type of its own. */
  .md1-expansion-panel__heading {
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
  .md1-expansion-panel__header {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--md1-icon-size, 24px);
    column-gap: var(--md1-spacing-2, 16px);
    /* Centre the rows as one block: stretched auto rows would split the 64 dp header's free space and drop the glyph off the label's line. */
    align-content: center;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-height: 48px;
    margin: 0;
    padding: 12px var(--md1-spacing-3, 24px);
    border: 0;
    border-radius: inherit;
    background: transparent;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font: inherit;
    text-align: start;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    transition:
      min-height var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      background-color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Expanded: the header grows to 64 dp (figure spec2), the text staying centred. */
  .md1-expansion-panel__header[data-state='open'] {
    min-height: 64px;
  }

  /*
   * Focus: Grey 200 on the focused list item (expansion-panels page), for
   * keyboard focus only; the page states no dark value, so the dark sheet takes
   * Vuetify 1.5's #494949 (th:155), both through --md1-panel-focus. The outline
   * is transparent so nothing paints beside the fill, solid so forced colours
   * still draw a ring, and inset so the sheet's clip keeps it.
   */
  .md1-expansion-panel__header:focus-visible {
    outline: 2px solid transparent;
    outline-offset: -2px;
    background-color: var(--md1-panel-focus, #EEEEEE);
  }

  /* Disabled: the page states nothing; the ink drops to the disabled tier and the row answers to nothing. */
  .md1-expansion-panel__header[data-disabled] {
    cursor: default;
    pointer-events: none;
  }

  /* Positioned so the text paints above the ink layer, which is absolutely positioned and would otherwise cover it. */
  .md1-expansion-panel__text,
  .md1-expansion-panel__summary,
  .md1-expansion-panel__cue {
    position: relative;
    min-width: 0;
  }

  .md1-expansion-panel__text {
    display: flex;
    flex-direction: column;
    grid-column: 1;
  }

  /* The label: Subheading, Regular 15 sp on desktop and 16 sp on handsets, 87% (the type token carries the switch). */
  .md1-expansion-panel__label {
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* Secondary content: Caption, Regular 12 sp at 54%; 16 px of leading makes the two-line row 64 dp. */
  .md1-expansion-panel__secondary {
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: var(--md1-type-caption-weight, 400);
    line-height: 16px;
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* The value column: the figures draw values in secondary grey at about the label's size (the page states neither). */
  .md1-expansion-panel__summary {
    grid-column: 1;
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * The expand icon: 24 dp, 38% black at rest, 54% on hover and press
   * (expansion-panels page), pointing down collapsed and up expanded. In the
   * last column across every row of the header.
   */
  .md1-expansion-panel__cue {
    display: inline-flex;
    grid-column: -2;
    /* Two rows on handsets, where the value drops under the label; the glyph centres across both. */
    grid-row: 1 / span 2;
    align-self: center;
    color: var(--md1-icon-inactive, rgba(0, 0, 0, 0.38));
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      color var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-expansion-panel__cue[data-state='open'] {
    transform: rotate(180deg);
  }

  .md1-expansion-panel__header:hover .md1-expansion-panel__cue,
  .md1-expansion-panel__header:active .md1-expansion-panel__cue {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  .md1-expansion-panel__header[data-disabled] .md1-expansion-panel__label,
  .md1-expansion-panel__header[data-disabled] .md1-expansion-panel__secondary,
  .md1-expansion-panel__header[data-disabled] .md1-expansion-panel__summary,
  .md1-expansion-panel__header[data-disabled] .md1-expansion-panel__cue {
    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* From the tablet breakpoint (layout/responsive-ui), the label and the value sit in two columns, one third to two thirds (a decision; the figures hold a fixed label column). */
  @media (min-width: 600px) {
    .md1-expansion-panel__header {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr) var(--md1-icon-size, 24px);
    }

    .md1-expansion-panel__summary {
      grid-column: 2;
    }

    /* Without a value column the label runs up to the icon. */
    .md1-expansion-panel__text:has(+ .md1-expansion-panel__cue) {
      grid-column: 1 / 3;
    }
  }

  /* Reduced motion: the row grows and the icon turns in one step. The plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .md1-expansion-panel__header,
  body[data-reduced-motion='reduce'] .md1-expansion-panel__cue {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .md1-expansion-panel__header,
    body:not([data-reduced-motion='no-preference']) .md1-expansion-panel__cue {
      transition: none;
    }
  }
</style>
