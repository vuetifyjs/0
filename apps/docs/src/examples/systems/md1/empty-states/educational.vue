<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon } from '@paper/md1'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="md1-docs-empty-stack">
    <div class="md1-docs-empty-screen">
      <div v-if="open" class="md1-docs-empty-lead">
        <Md1Card>
          <Md1Card.Title>Watch anywhere</Md1Card.Title>

          <Md1Card.Supporting>Movies you buy or rent appear here, ready to stream on your phone, tablet or TV. Download one to watch offline.</Md1Card.Supporting>

          <Md1Card.Actions>
            <Md1Button @click="open = false">Got it</Md1Button>

            <Md1Button>Learn more</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>

      <div v-else class="md1-docs-empty">
        <Md1Icon class="md1-docs-empty-art" name="play-arrow" />

        <p class="md1-docs-empty-tagline">Your movie library lives here</p>
      </div>
    </div>

    <Md1Button :disabled="open" @click="open = true">Show the card again</Md1Button>
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

  /* The educational card leads the content area, 8 dp in from the screen edges as a card collection is. */
  .md1-docs-empty-lead {
    padding: var(--md1-spacing-1, 8px);
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
