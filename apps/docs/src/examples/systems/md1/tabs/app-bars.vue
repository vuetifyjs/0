<script setup lang="ts">
  import { Md1Button, Md1SearchBar, Md1Tabs, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const ITEMS = ['Songs', 'Albums', 'Artists']

  const section = shallowRef('Songs')
  const place = shallowRef('Songs')
  const query = shallowRef('')
</script>

<template>
  <div class="md1-docs-tab-bars">
    <div class="md1-docs-tab-bar-screen">
      <Md1Toolbar prominent variant="primary">
        <Md1Toolbar.Nav />

        <Md1Toolbar.Title>Page title</Md1Toolbar.Title>

        <Md1Toolbar.Actions>
          <Md1Button aria-label="Search" icon="search" />

          <Md1Button aria-label="More options" icon="more-vert" />
        </Md1Toolbar.Actions>

        <Md1Toolbar.Extension>
          <Md1Tabs v-model="section">
            <Md1Tabs.List label="Sections">
              <Md1Tabs.Item v-for="item in ITEMS" :key="item" :label="item" :value="item" />
            </Md1Tabs.List>
          </Md1Tabs>
        </Md1Toolbar.Extension>
      </Md1Toolbar>
    </div>

    <div class="md1-docs-tab-bar-screen">
      <Md1Toolbar variant="primary">
        <div class="md1-docs-tab-bar-search">
          <Md1SearchBar v-model="query" class="md1-docs-tab-bar-field" placeholder="Search" voice />
        </div>

        <Md1Toolbar.Extension>
          <Md1Tabs v-model="place">
            <Md1Tabs.List label="Results">
              <Md1Tabs.Item v-for="item in ITEMS" :key="item" :label="item" :value="item" />
            </Md1Tabs.List>
          </Md1Tabs>
        </Md1Toolbar.Extension>
      </Md1Toolbar>
    </div>
  </div>
</template>

<style>
  .md1-docs-tab-bars {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
  }

  .md1-docs-tab-bar-screen {
    min-height: 160px;
    overflow: hidden;
    background: var(--md1-background, #FAFAFA);
  }

  /*
   * The inset search sits 8 dp inside the bar on each side, the search
   * pattern's inset sheet. The sheet is the theme's surface, so it takes the
   * theme's ink back from the bar's white.
   */
  .md1-docs-tab-bar-search {
    flex: 1 1 auto;
    min-width: 0;
    padding: var(--md1-spacing-1, 8px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-tab-bar-field {
    width: 100%;
  }

  /* The bar paints every button in its row white; the glyphs inside the search sheet keep the sheet's icon ink. */
  .md1-docs-tab-bar-search :is(.md1-search-bar__nav, .md1-search-bar__voice) {
    --md1-on-primary: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
