<script setup lang="ts">
  import { createMd1IconsContext, Md1Icon } from '@paper/md1'

  // Glyphs Material Design 1 does not ship, registered for this subtree.
  // Material Icons, filled, 24px (Apache License 2.0).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      'undo': ['M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z'],
      'redo': ['M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z'],
      'chat': ['M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z'],
      'volume-up': ['M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'],
    },
  })

  provideIcons()

  // `mirror` marks the glyphs this example registered itself: they are not in
  // the shipped mirror table, so the example flips them under RTL on its own.
  const groups = [
    {
      title: 'Mirrored',
      rows: [
        { icons: ['arrow-back'], caption: 'Back points toward the start' },
        { icons: ['arrow-forward'], caption: 'Forward points toward the end' },
        { icons: ['send'], caption: 'Movement forward' },
        { icons: ['volume-up'], mirror: true, caption: 'Sound waves leave toward the end' },
        { icons: ['undo', 'redo'], mirror: true, caption: 'Horizontal direction of time' },
        { icons: ['chat'], mirror: true, caption: 'Represents text: a ragged end edge' },
      ],
    },
    {
      title: 'Not mirrored',
      rows: [
        { icons: ['refresh'], caption: 'Clockwise: circular time' },
        { icons: ['history'], caption: 'Counterclockwise: circular time' },
        { icons: ['schedule'], caption: 'Clocks turn clockwise everywhere' },
        { icons: ['keyboard'], caption: 'A physical object' },
        { icons: ['search'], caption: 'Held in the right hand' },
        { icons: ['visibility-off'], caption: 'A slash stays as drawn' },
        { icons: ['play-arrow'], caption: 'Media plays left to right' },
      ],
    },
  ]
</script>

<template>
  <div class="md1-docs-bidi-icons md1-elevation-2">
    <!-- A grid rather than <table>: the docs prose styles every table inside a page. -->
    <div
      v-for="group in groups"
      :key="group.title"
      :aria-label="group.title"
      class="md1-docs-bidi-table"
      role="table"
    >
      <p class="md1-docs-bidi-table-title">{{ group.title }}</p>

      <div class="md1-docs-bidi-table-row" role="row">
        <span class="md1-docs-bidi-table-head" role="columnheader">LTR</span>

        <span class="md1-docs-bidi-table-head" role="columnheader">RTL</span>

        <span class="md1-docs-bidi-table-head" role="columnheader">Why</span>
      </div>

      <div
        v-for="row in group.rows"
        :key="row.icons.join()"
        class="md1-docs-bidi-table-row"
        role="row"
      >
        <span
          v-for="dir in ['ltr', 'rtl']"
          :key="dir"
          class="md1-docs-bidi-glyphs"
          :dir
          role="cell"
        >
          <Md1Icon
            v-for="icon in row.icons"
            :key="icon"
            :class="['md1-docs-bidi-glyph', { 'md1-docs-bidi-mirror': row.mirror }]"
            :name="icon"
          />
        </span>

        <span class="md1-docs-bidi-why" role="cell">{{ row.caption }}</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-bidi-icons {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px);
    box-sizing: border-box;
    width: 100%;
    max-width: 720px;
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-bidi-table {
    align-self: start;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }

  .md1-docs-bidi-table-title {
    margin: 0;
    padding: var(--md1-spacing-1, 8px) 0;
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: 500;
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-bidi-table-row {
    display: grid;
    grid-template-columns: 72px 72px 1fr;
    align-items: center;
    min-height: 48px;
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-bidi-table-row:first-of-type {
    min-height: 32px;
    border-top: 0;
  }

  .md1-docs-bidi-table-head {
    font-size: var(--md1-type-caption-size, 12px);
    font-weight: 500;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Each cell takes its own direction; an RTL cell lays a pair of glyphs out from the right. */
  .md1-docs-bidi-glyphs {
    display: flex;
    gap: var(--md1-spacing-1, 8px);
    padding-inline: var(--md1-spacing-1, 8px);
  }

  .md1-docs-bidi-glyph {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* The shipped roles flip through the package's own [dir='rtl'] rule; these are the example's glyphs. */
  [dir='rtl'] .md1-docs-bidi-mirror {
    transform: scaleX(-1);
  }

  .md1-docs-bidi-why {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
