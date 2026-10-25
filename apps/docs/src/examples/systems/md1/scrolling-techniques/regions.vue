<script setup lang="ts">
  import { Md1Button, Md1Switch, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const exploded = shallowRef(true)
  const tab = shallowRef('one')
</script>

<template>
  <div class="md1-docs-regions-stack">
    <Md1Switch v-model="exploded" label="Show the regions apart" />

    <div class="md1-docs-regions" :data-exploded="exploded || undefined">
      <span class="md1-docs-regions-label">Toolbar: 56 dp, 64 dp from 600 px</span>

      <Md1Toolbar class="md1-docs-regions-band" variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Title</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />
        </Md1Toolbar.Actions>
      </Md1Toolbar>

      <span class="md1-docs-regions-label">Tab or search bar: 48 dp</span>

      <Md1Tabs v-model="tab">
        <Md1Toolbar class="md1-docs-regions-band md1-docs-regions-tabs" variant="primary">
          <Md1Toolbar.Extension>
            <Md1Tabs.List label="Sections">
              <Md1Tabs.Item label="Item one" value="one" />

              <Md1Tabs.Item label="Item two" value="two" />

              <Md1Tabs.Item label="Item three" value="three" />
            </Md1Tabs.List>
          </Md1Toolbar.Extension>
        </Md1Toolbar>
      </Md1Tabs>

      <span class="md1-docs-regions-label">Flexible space: grows and shrinks with the scroll</span>

      <div class="md1-docs-regions-band md1-docs-regions-flexible">
        <span class="md1-type-display-1 md1-docs-regions-large">Large title</span>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-regions-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
    width: 100%;
    max-width: 480px;
  }

  /* The app bar's scrollable regions, stacked as they ship or pulled apart with a caption over each. */
  .md1-docs-regions {
    display: flex;
    flex-direction: column;
    width: 100%;
    box-shadow: var(--md1-elevation-4);
    transition: gap var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-regions[data-exploded] {
    gap: var(--md1-spacing-1, 8px);
    box-shadow: none;
  }

  /* Assembled, the regions are one surface: only the stack casts the shadow. */
  .md1-docs-regions:not([data-exploded]) .md1-docs-regions-band {
    box-shadow: none;
  }

  .md1-docs-regions-label {
    display: none;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-regions[data-exploded] .md1-docs-regions-label {
    display: block;
  }

  /* The tab bar on its own: the toolbar's row is empty here, so only the extension shows. */
  .md1-docs-regions-tabs .md1-toolbar__row {
    display: none;
  }

  .md1-docs-regions-flexible {
    display: flex;
    align-items: flex-end;
    box-sizing: border-box;
    height: 128px;
    padding: 0 var(--md1-spacing-2, 16px) var(--md1-spacing-3, 24px) 72px;
    background: var(--md1-primary, #3F51B5);
    box-shadow: var(--md1-elevation-4);
  }

  .md1-docs-regions-large {
    color: var(--md1-on-primary, #FFFFFF);
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-regions {
      transition: none;
    }
  }
</style>
