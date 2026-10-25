<script setup lang="ts">
  import { Md1BottomSheet, Md1Button, Md1IconToggle } from '@paper/md1'
  import { shallowRef } from 'vue'

  const saved = shallowRef(false)
</script>

<template>
  <div class="md1-docs-screen md1-docs-sheet-screen">
    <div class="md1-docs-sheet-reading md1-type-body-1">
      She had always done what she was told, and done it with a kind of

      <Md1BottomSheet v-slot="{ close }">
        <Md1BottomSheet.Activator v-slot="{ attrs }">
          <button v-bind="attrs" class="md1-docs-sheet-term" type="button">fervor</button>
        </Md1BottomSheet.Activator>

        <div class="md1-docs-sheet-definition-head">
          <div class="md1-docs-sheet-definition-word">
            <span class="md1-type-headline">fer·vor</span>

            <span class="md1-type-body-1">/ˈfərvər/</span>
          </div>

          <Md1IconToggle
            v-model="saved"
            aria-label="Save fervor to your word list"
            icon="star-border"
            icon-on="star"
          />
        </div>

        <div class="md1-docs-sheet-definition md1-type-body-1">
          <span class="md1-docs-sheet-definition-class">noun</span>

          <span>Intense and passionate feeling.</span>

          <span class="md1-docs-sheet-definition-quote">“he talked with all the fervor of a new convert”</span>

          <span class="md1-docs-sheet-definition-class">synonyms: passion, ardor, intensity, zeal, vehemence, emotion, warmth, earnestness, avidity, eagerness, enthusiasm</span>
        </div>

        <div class="md1-docs-sheet-definition-actions">
          <Md1Button @click="close()">Close</Md1Button>
        </div>
      </Md1BottomSheet>

      that no one had expected of a child so young.
    </div>
  </div>
</template>

<style>
  .md1-docs-sheet-screen {
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-sheet-reading {
    margin: 0;
    padding: var(--md1-spacing-2, 16px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The term reads as a link inside the paragraph; pressing it deep-links the dictionary into a sheet. */
  .md1-docs-sheet-term {
    padding: 0;
    border: 0;
    background: none;
    color: var(--md1-primary, #3F51B5);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }

  /* The other app's header: its own colour, flush with the sheet's top edge. */
  .md1-docs-sheet-definition-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-block-start: calc(-1 * var(--md1-spacing-1, 8px));
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px) var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px);
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-sheet-definition-head .md1-icon-toggle {
    color: inherit;
  }

  .md1-docs-sheet-definition-word {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .md1-docs-sheet-definition {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) 0;
  }

  .md1-docs-sheet-definition-class,
  .md1-docs-sheet-definition-quote {
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-sheet-definition-class {
    font-style: italic;
  }

  .md1-docs-sheet-definition-actions {
    padding: var(--md1-spacing-1, 8px);
  }
</style>
