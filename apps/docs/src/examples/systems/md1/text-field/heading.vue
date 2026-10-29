<script setup lang="ts">
  import { Md1Button, Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const destination = shallowRef('')
  const boxed = shallowRef('')
  const location = shallowRef('')
</script>

<template>
  <div class="md1-docs-headings">
    <section aria-labelledby="md1-docs-heading-flight" class="md1-docs-heading-screen">
      <h3 id="md1-docs-heading-flight" class="md1-docs-heading-title md1-type-display-1">Enter your destination</h3>

      <p class="md1-docs-heading-subtitle md1-type-subheading">Book a flight to anywhere in the world.</p>

      <Md1TextField v-model="destination" heading label="Destination" placeholder="Ex. San Francisco, CA" />

      <div class="md1-docs-heading-actions">
        <Md1Button variant="raised">Submit</Md1Button>
      </div>
    </section>

    <section aria-labelledby="md1-docs-heading-box" class="md1-docs-heading-screen">
      <h3 id="md1-docs-heading-box" class="md1-docs-heading-title md1-type-display-1">Enter your destination</h3>

      <p class="md1-docs-heading-subtitle md1-type-subheading">Book a flight to anywhere in the world.</p>

      <Md1TextField
        v-model="boxed"
        box
        heading
        label="Destination"
        placeholder="Ex. San Francisco, CA"
      />

      <div class="md1-docs-heading-actions">
        <Md1Button variant="raised">Submit</Md1Button>
      </div>
    </section>

    <div class="md1-docs-heading-scrim">
      <section
        aria-labelledby="md1-docs-heading-dialog"
        class="md1-docs-heading-dialog md1-elevation-24"
        role="group"
      >
        <h3 id="md1-docs-heading-dialog" class="md1-docs-heading-dialog-title md1-type-title">Verify your location to continue</h3>

        <Md1TextField v-model="location" heading label="Location" placeholder="Address, city, or zip code" />

        <div class="md1-docs-heading-dialog-actions">
          <Md1Button>Cancel</Md1Button>

          <Md1Button>Submit</Md1Button>
        </div>
      </section>
    </div>
  </div>
</template>

<style>
  .md1-docs-headings {
    display: grid;
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-heading-screen {
    display: flex;
    flex-direction: column;
    padding: var(--md1-spacing-3, 24px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-background, #FAFAFA);
    border: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  .md1-docs-heading-title {
    margin: 0;
  }

  .md1-docs-heading-subtitle {
    margin: var(--md1-spacing-2, 16px) 0 var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-heading-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: var(--md1-spacing-3, 24px);
  }

  /* The dialog sits on the theme's dialog scrim over the screen it interrupts. */
  .md1-docs-heading-scrim {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    background: linear-gradient(var(--md1-scrim, rgba(33, 33, 33, 0.46)), var(--md1-scrim, rgba(33, 33, 33, 0.46))), var(--md1-background, #FAFAFA);
  }

  /* The dialog page's measures: 24 dp padding, the 20 sp title, 8 dp action padding. */
  .md1-docs-heading-dialog {
    box-sizing: border-box;
    width: 100%;
    max-width: 320px;
    padding: var(--md1-spacing-3, 24px) var(--md1-spacing-3, 24px) var(--md1-spacing-1, 8px);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-heading-dialog-title {
    margin: 0;
  }

  .md1-docs-heading-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    margin: var(--md1-spacing-3, 24px) calc(-1 * var(--md1-spacing-2, 16px)) 0 0;
  }
</style>
