<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1List, Md1Subheader } from '@paper/md1'

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
  <div class="md1-docs-empty-stack">
    <div class="md1-docs-empty-screen">
      <div v-if="books.length > 0">
        <Md1Subheader>Free to start with</Md1Subheader>

        <Md1List :lines="2">
          <Md1List.Item v-for="book in books" :key="book.id">
            <Md1List.Icon name="bookmark" />

            <Md1List.Content>
              <Md1List.Primary>{{ book.title }}</Md1List.Primary>

              <Md1List.Secondary>{{ book.author }}</Md1List.Secondary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Button :aria-label="`Remove ${book.title}`" icon="close" @click="onRemove(book.id)" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>
      </div>

      <div v-else class="md1-docs-empty">
        <Md1Icon class="md1-docs-empty-art" name="bookmark" />

        <p class="md1-docs-empty-tagline">Books you read live on this shelf</p>
      </div>
    </div>

    <Md1Button :disabled="books.length === starter.length" @click="onReset">Restore samples</Md1Button>
  </div>
</template>

<style>
  .md1-docs-empty-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  /* A handset content area on the theme background: the empty state belongs to the screen, it is not a sheet of its own. */
  .md1-docs-empty-screen {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 360px;
    min-height: 320px;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px);
    text-align: center;
  }

  /* The non-interactive image: a 96 dp glyph in the disabled ink, subtle and neutral against the background. */
  .md1-docs-empty-art {
    --md1-icon-size: 96px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  /* The tagline: Subheading in the secondary ink, worded as a statement rather than an instruction. */
  .md1-docs-empty-tagline {
    max-width: 280px;
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    font-weight: var(--md1-type-subheading-weight, 400);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
