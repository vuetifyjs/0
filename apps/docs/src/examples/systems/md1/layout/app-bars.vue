<script setup lang="ts">
  import { Md1Button, Md1TextField, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const title = shallowRef('Project priorities')
  const description = shallowRef('Sync with the team about Q3')
</script>

<template>
  <div class="md1-docs-layout-appbars">
    <figure class="md1-docs-layout-appbars-figure">
      <!-- Single colour: title and icons share the bar's ink. -->
      <Md1Toolbar class="md1-docs-layout-appbars-blue" variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Title</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="Favourite" icon="favorite" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <figcaption class="md1-docs-layout-appbars-caption">Single colour (default)</figcaption>
    </figure>

    <figure class="md1-docs-layout-appbars-figure">
      <!-- Distinct title: white title, every icon one darker colour. -->
      <Md1Toolbar class="md1-docs-layout-appbars-blue md1-docs-layout-appbars-distinct" variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Title</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="Favourite" icon="favorite" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <figcaption class="md1-docs-layout-appbars-caption">Distinct title colour</figcaption>
    </figure>

    <figure class="md1-docs-layout-appbars-figure">
      <!-- An extended app bar: an action area, then title and description areas that are fields. -->
      <div class="md1-docs-layout-appbars-extended md1-elevation-4" data-theme="md1-dark">
        <Md1Toolbar class="md1-docs-layout-appbars-action" variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Actions>
            <Md1Button aria-label="More options" icon="more-vert" />
          </Md1Toolbar.Actions>
        </Md1Toolbar>

        <div class="md1-docs-layout-appbars-area" data-area="title">
          <Md1TextField v-model="title" class="md1-docs-layout-appbars-title" label="Title" />
        </div>

        <div class="md1-docs-layout-appbars-area" data-area="description">
          <Md1TextField v-model="description" label="Description" />
        </div>

        <span aria-hidden="true" class="md1-docs-layout-appbars-redlines">
          <span class="md1-docs-layout-appbars-redline" style="height: 56px">56</span>

          <span class="md1-docs-layout-appbars-redline" style="height: 80px">80</span>

          <span class="md1-docs-layout-appbars-redline" style="height: 8px">8</span>

          <span class="md1-docs-layout-appbars-redline" style="height: 72px">72</span>

          <span class="md1-docs-layout-appbars-redline" style="height: 16px">16</span>
        </span>
      </div>

      <figcaption class="md1-docs-layout-appbars-caption">Extended: 56 dp actions, 80 dp title, 72 dp description</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-layout-appbars {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    max-width: 480px;
  }

  .md1-docs-layout-appbars-figure {
    margin: 0;
  }

  /* The figure's Light Blue 600 bar, a colour dark enough for white and light enough for black glyphs. */
  .md1-docs-layout-appbars-blue {
    --md1-primary: #039BE5;
  }

  .md1-toolbar.md1-docs-layout-appbars-distinct[data-variant='primary'] .md1-toolbar__row .md1-button:not([data-disabled]),
  .md1-toolbar.md1-docs-layout-appbars-distinct[data-variant='primary'] .md1-toolbar__row .md1-toolbar__nav {
    color: rgba(0, 0, 0, 0.54);
  }

  /* The extended bar's areas are fixed heights; the fields sit at the bottom of each. */
  .md1-docs-layout-appbars-extended {
    position: relative;
    padding-bottom: 16px;
    background: var(--md1-primary, #3F51B5);
  }

  .md1-docs-layout-appbars-action {
    --md1-increment: 56px;
  }

  .md1-docs-layout-appbars-area {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-inline: 72px 16px;
  }

  .md1-docs-layout-appbars-area[data-area='title'] {
    height: 80px;
    margin-bottom: 8px;
  }

  .md1-docs-layout-appbars-area[data-area='description'] {
    height: 72px;
  }

  .md1-docs-layout-appbars-title input {
    font-size: var(--md1-type-headline-size, 24px);
  }

  /* Redlines on the start edge, one per area, labelled in dp. */
  .md1-docs-layout-appbars-redlines {
    position: absolute;
    inset-block-start: 0;
    inset-inline-start: 0;
    display: flex;
    flex-direction: column;
    pointer-events: none;
  }

  .md1-docs-layout-appbars-redline {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 40px;
    padding-inline-start: 4px;
    border-inline-start: 2px solid #E91E63;
    border-top: 1px solid #E91E63;
    color: #FFFFFF;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 1;
  }

  .md1-docs-layout-appbars-caption {
    margin-top: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    text-align: center;
  }
</style>
