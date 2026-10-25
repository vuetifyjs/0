<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Chip, Md1SearchBar, Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const query = shallowRef('')
  const share = shallowRef('')

  const CONTRACTIONS = ['it’s', 'can’t', 'wouldn’t', 'you’re', 'you’ve', 'haven’t', 'don’t']
</script>

<template>
  <div class="md1-docs-writing-stack md1-docs-writing-punctuation">
    <div class="md1-docs-writing-grid">
      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1SearchBar v-model="query" placeholder="Search settings" />
        </div>

        <figcaption class="md1-docs-writing-rule">Sentence-style caps</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Supporting>
              Share your photos with friends. <a class="md1-docs-writing-link" href="#writing-learn-more" @click.prevent>Learn more</a>
            </Md1Card.Supporting>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">A period before a link</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <p class="md1-docs-writing-dialog-title md1-type-title">Undo bulk edit?</p>

          <p class="md1-docs-writing-dialog-text md1-type-body-1">If you undo this bulk edit, everything you changed will go back to its previous state</p>

          <div class="md1-docs-writing-dialog-actions">
            <Md1Button>Cancel</Md1Button>

            <Md1Button>Undo</Md1Button>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">No period after a solitary sentence</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1TextField v-model="share" label="Share with" />
        </div>

        <figcaption class="md1-docs-writing-rule">No colon after a label</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad md1-docs-writing-chips">
          <Md1Chip v-for="word in CONTRACTIONS" :key="word">{{ word }}</Md1Chip>
        </div>

        <figcaption class="md1-docs-writing-rule">Use contractions</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Title>Welcome!</Md1Card.Title>

            <Md1Card.Actions>
              <Md1Button>Next</Md1Button>
            </Md1Card.Actions>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">Exclamation points for greetings only</figcaption>
      </figure>
    </div>
  </div>
</template>

<style>
  .md1-docs-writing-stack {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* 320 dp columns: a handset snackbar fills its frame, and from 600 px the 288 dp desktop snackbar still fits inside it. */
  .md1-docs-writing-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    align-items: start;
  }

  .md1-docs-writing-item {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    min-width: 0;
    margin: 0;
  }

  .md1-docs-writing-rule {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    line-height: 16px;
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* A handset's content area on the theme background, for copy that sits on the screen rather than on a sheet. */
  .md1-docs-writing-pad,
  .md1-docs-writing-empty {
    box-sizing: border-box;
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-writing-sheet {
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-writing-progress {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-writing-body {
    margin: 0;
  }

  /* The empty-states page: a neutral glyph in the disabled ink over a Subheading statement. */
  .md1-docs-writing-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    text-align: center;
  }

  .md1-docs-writing-empty-art {
    --md1-icon-size: 48px;

    color: var(--md1-text-disabled, rgba(0, 0, 0, 0.38));
  }

  .md1-docs-writing-empty-text {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-subheading-size, 16px);
    line-height: var(--md1-type-subheading-leading, 24px);
    letter-spacing: var(--md1-type-subheading-tracking, 0.01em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* A snackbar needs a screen to sit at the bottom of: containment makes this frame the portal's containing block. */
  .md1-docs-writing-snack {
    position: relative;
    display: flex;
    height: 104px;
    overflow: clip;
    contain: layout paint;
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /*
   * The dialog anatomy, drawn in place: a modal <dialog> shows one at a time,
   * so the gallery sets the dialogs page's sheet from the same tokens.
   * Title style 24 dp in, 20 dp to the text; actions 8 dp in, ending the row.
   */
  .md1-docs-writing-dialog {
    box-sizing: border-box;
    margin: var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-writing-dialog-title {
    margin: 0;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) 20px;
    line-height: 28px;
  }

  .md1-docs-writing-dialog-text {
    margin: 0;
    padding: 0 var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px);
  }

  .md1-docs-writing-dialog-title + .md1-docs-writing-dialog-text {
    margin-top: -4px;
  }

  .md1-docs-writing-dialog-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }
</style>

<style>
  .md1-docs-writing-chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--md1-spacing-1, 8px);
  }

  /* "Buttons appear in dialogs and as blue or underlined text": the primary on light, its 100 tone on dark sheets where the 500 falls under 4.5:1. */
  .md1-docs-writing-link {
    color: var(--md1-primary, #3F51B5);
  }

  [data-theme='md1-dark'] .md1-docs-writing-link {
    color: var(--md1-primary-light, #C5CAE9);
  }
</style>
