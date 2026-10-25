<script setup lang="ts">
  import { createMd1IconsContext, Md1Button, Md1Divider } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  // Material Icons editor glyphs, filled, 24px (Apache License 2.0).
  const [, provideIcons] = createMd1IconsContext({
    icons: {
      'format-bold': ['M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z'],
      'format-italic': ['M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z'],
      'format-align-left': ['M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z'],
      'format-list-bulleted': ['M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z'],
      'format-indent-decrease': ['M11 17h10v-2H11v2zm-8-5l4 4V8l-4 4zm0 9h18v-2H3v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z'],
      'format-indent-increase': ['M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z'],
    },
  })

  provideIcons()

  const paragraphs = [
    { id: 'en', dir: 'ltr', lang: 'en', label: 'English paragraph', text: 'This paragraph is English, so the toolbar reads left to right. Move into the Hebrew paragraph below and watch the alignment, list and indent buttons turn around.' },
    { id: 'he', dir: 'rtl', lang: 'he', label: 'Hebrew paragraph', text: 'זוהי פסקה בעברית בתוך מסמך באנגלית. הכפתורים להזחה ולרשימות פונים לימין.' },
  ]

  // Buttons that describe a line of text mirror; bold and italic do not.
  const tools = [
    { icon: 'format-bold', label: 'Bold' },
    { icon: 'format-italic', label: 'Italic' },
    { icon: 'format-align-left', label: 'Align to start', mirror: true },
    { icon: 'format-list-bulleted', label: 'Bulleted list', mirror: true },
    { icon: 'format-indent-decrease', label: 'Decrease indent', mirror: true },
    { icon: 'format-indent-increase', label: 'Increase indent', mirror: true },
  ]

  const active = shallowRef('en')
  const dir = toRef(() => paragraphs.find(paragraph => paragraph.id === active.value)?.dir ?? 'ltr')
</script>

<template>
  <div class="md1-docs-bidi-editor md1-elevation-2" dir="ltr">
    <div aria-label="Formatting" class="md1-docs-bidi-editor-tools" :dir role="toolbar">
      <Md1Button
        v-for="tool in tools"
        :key="tool.icon"
        :aria-label="tool.label"
        :class="{ 'md1-docs-bidi-editor-mirror': tool.mirror }"
        :icon="tool.icon"
      />
    </div>

    <Md1Divider />

    <div class="md1-docs-bidi-editor-page">
      <p
        v-for="paragraph in paragraphs"
        :key="paragraph.id"
        :aria-label="paragraph.label"
        aria-multiline="true"
        class="md1-type-body-1 md1-docs-bidi-editor-paragraph"
        contenteditable="true"
        :data-active="active === paragraph.id || undefined"
        :dir="paragraph.dir"
        :lang="paragraph.lang"
        role="textbox"
        @focus="active = paragraph.id"
      >{{ paragraph.text }}</p>
    </div>
  </div>
</template>

<style>
  .md1-docs-bidi-editor {
    box-sizing: border-box;
    width: 100%;
    max-width: 560px;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-bidi-editor-tools {
    display: flex;
    flex-wrap: wrap;
    padding: 0 var(--md1-spacing-1, 8px);
  }

  .md1-docs-bidi-editor-tools .md1-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }

  /* Editor glyphs are the example's own, outside the shipped mirror table, so they flip here. */
  [dir='rtl'] > .md1-docs-bidi-editor-mirror .md1-icon {
    transform: scaleX(-1);
  }

  .md1-docs-bidi-editor-page {
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-bidi-editor-paragraph {
    margin: var(--md1-spacing-1, 8px) 0 0;
    padding: var(--md1-spacing-1, 8px);
    border-radius: var(--md1-radius, 2px);
    outline: none;
  }

  .md1-docs-bidi-editor-paragraph[data-active] {
    background: var(--md1-hover, rgba(0, 0, 0, 0.04));
  }
</style>
