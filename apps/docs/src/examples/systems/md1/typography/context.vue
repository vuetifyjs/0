<script setup lang="ts">
  import { Md1Button, Md1Divider, Md1List, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-type-context">
    <div class="md1-docs-type-context-screen md1-elevation-2">
      <Md1Toolbar>
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Weather</Md1Toolbar.Title>
      </Md1Toolbar>

      <div class="md1-docs-type-context-body">
        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-display-3">23°</p>

          <span class="md1-docs-type-context-tag">Display 3</span>
        </div>

        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-headline">Lisbon</p>

          <span class="md1-docs-type-context-tag">Headline</span>
        </div>

        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-subheading">Partly cloudy, light wind from the north</p>

          <span class="md1-docs-type-context-tag">Subheading</span>
        </div>

        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-body-2">This afternoon</p>

          <span class="md1-docs-type-context-tag">Body 2</span>
        </div>

        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-body-1">Sun and cloud through the morning, clearing by the afternoon. A high of 25° and a low of 17°.</p>

          <span class="md1-docs-type-context-tag">Body 1</span>
        </div>

        <div class="md1-docs-type-context-row">
          <p class="md1-docs-type-context-sample md1-type-caption">Updated 10 minutes ago</p>

          <span class="md1-docs-type-context-tag">Caption</span>
        </div>

        <div class="md1-docs-type-context-row">
          <div class="md1-docs-type-context-sample">
            <Md1Button>Ten-day forecast</Md1Button>
          </div>

          <span class="md1-docs-type-context-tag">Button</span>
        </div>
      </div>

      <Md1Divider />

      <Md1List :lines="2">
        <Md1List.Item>
          <Md1List.Content>
            <Md1List.Primary>Porto</Md1List.Primary>

            <Md1List.Secondary>19°, showers</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Content>
            <Md1List.Primary>Faro</Md1List.Primary>

            <Md1List.Secondary>27°, sunny</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <p class="md1-docs-note">The toolbar sets its title in Title, list primary text in Subheading and secondary text in Body 1.</p>
  </div>
</template>

<style>
  .md1-docs-type-context {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-type-context-screen {
    width: min(100%, 400px);
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-type-context-body {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
  }

  /* Each line carries a tag naming its style, at the end of the row. */
  .md1-docs-type-context-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-type-context-sample {
    min-width: 0;
    margin: 0;
  }

  .md1-docs-type-context-tag {
    flex: none;
    padding: 0 6px;
    border-radius: var(--md1-radius, 2px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: 11px;
    line-height: 18px;
    color: var(--md1-accent, #FF4081);
    box-shadow: inset 0 0 0 1px var(--md1-accent, #FF4081);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
