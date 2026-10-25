<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon, Md1TextField } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  import type { Md1IconName } from '@paper/md1'

  interface Product {
    id: string
    name: string
    icon: Md1IconName
    tone: string
  }

  const products: Product[] = [
    { id: 'chair', name: 'Desk chair', icon: 'person', tone: 'teal' },
    { id: 'lamp', name: 'Reading lamp', icon: 'visibility', tone: 'amber' },
    { id: 'bowl', name: 'Glass bowl', icon: 'favorite', tone: 'blue' },
    { id: 'pens', name: 'Fountain pens', icon: 'create', tone: 'pink' },
    { id: 'clock', name: 'Wall clock', icon: 'clock', tone: 'grey' },
    { id: 'map', name: 'City map', icon: 'place', tone: 'green' },
  ]

  const query = shallowRef('')
  const open = shallowRef('')

  const visible = toRef(() => products.filter(product => product.name.toLowerCase().includes(query.value.trim().toLowerCase())))
  const product = toRef(() => products.find(item => item.id === open.value))
</script>

<template>
  <div class="md1-docs-screen md1-docs-integrated">
    <div v-if="product" class="md1-docs-integrated-detail">
      <div class="md1-docs-integrated-head">
        <Md1Button aria-label="Shop" icon="arrow-back" @click="open = ''" />
      </div>

      <div class="md1-docs-integrated-art md1-docs-integrated-art--large" :data-tone="product.tone">
        <Md1Icon :name="product.icon" />
      </div>

      <h3 class="md1-docs-integrated-title md1-type-headline">{{ product.name }}</h3>
    </div>

    <template v-else>
      <div class="md1-docs-integrated-head">
        <Md1Button aria-label="Open navigation" icon="menu" />

        <Md1TextField v-model="query" class="md1-docs-integrated-search" label="Search" />
      </div>

      <div class="md1-docs-integrated-grid">
        <Md1Card
          v-for="item in visible"
          :key="item.id"
          class="md1-docs-integrated-card"
        >
          <button class="md1-docs-integrated-link" type="button" @click="open = item.id">
            <span class="md1-docs-integrated-art" :data-tone="item.tone">
              <Md1Icon :name="item.icon" />
            </span>

            <span class="md1-docs-integrated-name">{{ item.name }}</span>
          </button>
        </Md1Card>
      </div>
    </template>
  </div>
</template>

<style>
  /*
   * Navigation integrated into content: the menu icon and the search field sit
   * in the content's own header, not in an app bar, and each product card is a
   * link into its detail. The grid takes two columns on a handset and more as
   * the window widens.
   */
  .md1-docs-screen.md1-docs-integrated {
    height: 480px;
    overflow-y: auto;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-integrated-head {
    display: flex;
    align-items: flex-end;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) 0 4px;
    background: var(--md1-surface, #FFFFFF);
  }

  .md1-docs-integrated-search {
    flex: 1 1 auto;
    min-width: 0;
  }

  .md1-docs-integrated-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-integrated-card {
    overflow: hidden;
  }

  .md1-docs-integrated-link {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0;
    font: inherit;
    color: inherit;
    text-align: start;
    background: none;
    border: 0;
    cursor: pointer;
  }

  .md1-docs-integrated-link:focus-visible {
    outline: 2px solid var(--md1-primary, #3F51B5);
    outline-offset: -2px;
  }

  /* Each product's picture: a glyph on a 100 tint of its hue stands in for the photograph. */
  .md1-docs-integrated-art {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    --md1-icon-size: 48px;
  }

  .md1-docs-integrated-art--large {
    max-height: 200px;
    aspect-ratio: auto;
    height: 200px;
    --md1-icon-size: 96px;
  }

  .md1-docs-integrated-art[data-tone='teal'] { background: var(--md1-teal-100, #B2DFDB); color: var(--md1-teal-800, #00695C); }
  .md1-docs-integrated-art[data-tone='amber'] { background: var(--md1-amber-100, #FFECB3); color: var(--md1-amber-900, #FF6F00); }
  .md1-docs-integrated-art[data-tone='blue'] { background: var(--md1-blue-100, #BBDEFB); color: var(--md1-blue-800, #1565C0); }
  .md1-docs-integrated-art[data-tone='pink'] { background: var(--md1-pink-100, #F8BBD0); color: var(--md1-pink-800, #AD1457); }
  .md1-docs-integrated-art[data-tone='grey'] { background: var(--md1-grey-300, #E0E0E0); color: var(--md1-grey-800, #424242); }
  .md1-docs-integrated-art[data-tone='green'] { background: var(--md1-green-100, #C8E6C9); color: var(--md1-green-800, #2E7D32); }

  .md1-docs-integrated-name {
    padding: var(--md1-spacing-2, 16px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-integrated-title {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
  }
</style>
