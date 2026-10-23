<script setup lang="ts">
  import { QuButton, QuCard, QuIcon } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-empty-stack">
    <div class="quantum-docs-empty-screen">
      <div v-if="open" class="quantum-docs-empty-lead">
        <QuCard>
          <QuCard.Title>Watch anywhere</QuCard.Title>

          <QuCard.Supporting>Movies you buy or rent appear here, ready to stream on your phone, tablet or TV. Download one to watch offline.</QuCard.Supporting>

          <QuCard.Actions>
            <QuButton @click="open = false">Got it</QuButton>

            <QuButton>Learn more</QuButton>
          </QuCard.Actions>
        </QuCard>
      </div>

      <div v-else class="quantum-docs-empty">
        <QuIcon class="quantum-docs-empty-art" name="play-arrow" />

        <p class="quantum-docs-empty-tagline">Your movie library lives here</p>
      </div>
    </div>

    <QuButton :disabled="open" @click="open = true">Show the card again</QuButton>
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

  /* The educational card leads the content area, 8 dp in from the screen edges as a card collection is. */
  .quantum-docs-empty-lead {
    padding: var(--quantum-spacing-1, 8px);
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
