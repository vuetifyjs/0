<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const title = shallowRef('Vintage 50’s dress')
  const price = shallowRef('10.00')
  const location = shallowRef('Hanover')
  const description = shallowRef('Unique and rare dress from 1952. Made out of washed cotton with front pockets. Sleeveless with button closures.')
  const message = shallowRef('')
</script>

<template>
  <div class="md1-docs-box-areas">
    <div class="md1-docs-box-listing">
      <Md1TextField v-model="title" box label="Title" />

      <div class="md1-docs-box-row">
        <Md1TextField
          v-model="price"
          box
          class="md1-docs-box-price"
          inputmode="decimal"
          label="Price"
          prefix="$"
        />

        <Md1TextField v-model="location" box label="Location" optional />
      </div>

      <Md1TextField v-model="description" box label="Description" multiline />
    </div>

    <Md1TextField v-model="message" box label="Message" textarea />
  </div>
</template>

<style>
  .md1-docs-box-areas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-4, 32px);
    align-items: start;
    width: 100%;
  }

  .md1-docs-box-listing {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-box-row {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-box-price {
    flex: 0 0 96px;
  }
</style>
