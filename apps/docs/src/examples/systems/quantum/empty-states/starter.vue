<script setup lang="ts">
  import { QuButton, QuIcon, QuList, QuSubheader } from '@paper/quantum'

  import { ref } from 'vue'

  const starter = [
    { id: 'harbour', title: 'The Harbour Light', author: 'Mara Ellison' },
    { id: 'orchard', title: 'An Orchard in Winter', author: 'Tomas Reyes' },
    { id: 'signal', title: 'Signal and Noise', author: 'Priya Natarajan' },
  ]

  const books = ref([...starter])

  function onRemove (id: string) {
    books.value = books.value.filter(book => book.id !== id)
  }

  function onReset () {
    books.value = [...starter]
  }
</script>

<template>
  <div class="quantum-docs-empty-stack">
    <div class="quantum-docs-empty-screen">
      <div v-if="books.length > 0">
        <QuSubheader>Free to start with</QuSubheader>

        <QuList :lines="2">
          <QuList.Item v-for="book in books" :key="book.id">
            <QuList.Icon name="bookmark" />

            <QuList.Content>
              <QuList.Primary>{{ book.title }}</QuList.Primary>

              <QuList.Secondary>{{ book.author }}</QuList.Secondary>
            </QuList.Content>

            <QuList.Action>
              <QuButton :aria-label="`Remove ${book.title}`" icon="close" @click="onRemove(book.id)" />
            </QuList.Action>
          </QuList.Item>
        </QuList>
      </div>

      <div v-else class="quantum-docs-empty">
        <QuIcon class="quantum-docs-empty-art" name="bookmark" />

        <p class="quantum-docs-empty-tagline">Books you read live on this shelf</p>
      </div>
    </div>

    <QuButton :disabled="books.length === starter.length" @click="onReset">Restore samples</QuButton>
  </div>
</template>

<style>
  .quantum-docs-empty-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  /* A handset content area on the theme background: the empty state belongs to the screen, it is not a sheet of its own. */
  .quantum-docs-empty-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    min-height: 320px;
    background: var(--quantum-background, #FAFAFA);
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-3, 24px) var(--quantum-keyline-margin, 16px);
    text-align: center;
  }

  /* The non-interactive image: a 96 dp glyph in the disabled ink, subtle and neutral against the background. */
  .quantum-docs-empty-art {
    --quantum-icon-size: 96px;

    color: var(--quantum-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* The tagline: Subheading in the secondary ink, worded as a statement rather than an instruction. */
  .quantum-docs-empty-tagline {
    max-width: 280px;
    margin: 0;
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-subheading-size, 16px);
    font-weight: var(--quantum-type-subheading-weight, 400);
    line-height: var(--quantum-type-subheading-leading, 24px);
    letter-spacing: var(--quantum-type-subheading-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
