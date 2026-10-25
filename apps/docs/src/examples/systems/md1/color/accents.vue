<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Checkbox, Md1Fab, Md1Icon, Md1List, Md1Switch, Md1Toolbar } from '@paper/md1'
  import { shallowRef } from 'vue'

  const wifi = shallowRef(true)
  const sync = shallowRef(true)
  const backup = shallowRef(false)
  const night = shallowRef(true)

  const CONTACTS = ['Ali Connors', 'Sandra Adams', 'Trevor Hansen'] as const
</script>

<template>
  <div class="md1-docs-accents">
    <figure class="md1-docs-accents-item">
      <div class="md1-docs-accents-screen">
        <div class="md1-docs-accents-status" />

        <Md1Toolbar variant="primary">
          <Md1Toolbar.Nav />

          <Md1Toolbar.Title>Contacts</Md1Toolbar.Title>
        </Md1Toolbar>

        <div class="md1-docs-accents-related md1-type-body-2">Favourites</div>

        <Md1List>
          <Md1List.Item v-for="name in CONTACTS" :key="name">
            <Md1List.Avatar>{{ name[0] }}</Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>{{ name }}</Md1List.Primary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Icon class="md1-docs-accents-primary-icon" label="Call" name="phone" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>

        <Md1Fab aria-label="Add contact" icon="add" />
      </div>

      <figcaption class="md1-docs-note">Bold colour: primary on the bars, its 100 tone on related information, the accent on the action button, the primary on the phone icons</figcaption>
    </figure>

    <figure class="md1-docs-accents-item">
      <div class="md1-docs-accents-screen">
        <div class="md1-docs-accents-status md1-docs-accents-status-light" />

        <Md1Toolbar class="md1-docs-accents-dark-bar" variant="primary">
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Title>Settings</Md1Toolbar.Title>
        </Md1Toolbar>

        <Md1List>
          <Md1List.Item>
            <Md1List.Content>
              <Md1List.Primary>Wi-Fi</Md1List.Primary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="wifi" aria-label="Wi-Fi" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>

        <div class="md1-docs-accents-primary-accent">
          <Md1Checkbox v-model="sync" label="Sync photos" />

          <Md1Checkbox v-model="backup" label="Back up on mobile data" />
        </div>

        <div class="md1-docs-accents-night" data-theme="md1-dark">
          <Md1Switch v-model="night" label="Night mode" />
        </div>
      </div>

      <figcaption class="md1-docs-note">The switch in the accent; the checkboxes with the primary as their accent; the bar a darker tone than the system bar; on the dark strip, a lighter tone of the accent</figcaption>
    </figure>

    <figure class="md1-docs-accents-item">
      <div class="md1-docs-accents-screen">
        <div class="md1-docs-accents-hero">
          <p class="md1-docs-accents-hero-headline md1-type-display-1">Coastal walks</p>

          <p class="md1-docs-accents-hero-text md1-type-body-1">Six routes, one weekend</p>

          <Md1Fab aria-label="Save" class="md1-docs-accents-tonal-fab" icon="bookmark" position="static" />
        </div>

        <div class="md1-docs-accents-copy">
          <p class="md1-docs-accents-headline md1-type-headline">Pine ridge loop</p>

          <p class="md1-docs-accents-body md1-type-body-1">
            An 8 km loop above the harbour. <a class="md1-docs-accents-link" href="#accents-map" @click.prevent>See the map</a> or read the <a class="md1-docs-accents-link-primary" href="#accents-notes" @click.prevent>trail notes</a>.
          </p>

          <div class="md1-docs-accents-actions">
            <Md1Button>Share</Md1Button>

            <div class="md1-docs-accents-secondary-action">
              <Md1Button variant="raised">Book a guide</Md1Button>
            </div>
          </div>
        </div>
      </div>

      <figcaption class="md1-docs-note">Text accents: a tone of the accent on the primary headline area, the primary on a headline, the accent and primary on links, the accent on the primary action button, a lighter primary tone on a button resting on the primary</figcaption>
    </figure>

    <figure class="md1-docs-accents-item">
      <div class="md1-docs-accents-screen md1-docs-accents-mono">
        <Md1Toolbar>
          <Md1Toolbar.Nav />

          <Md1Toolbar.Title>Gallery</Md1Toolbar.Title>
        </Md1Toolbar>

        <div class="md1-docs-accents-mono-content">
          <Md1Card>
            <Md1Card.Media ratio="16:9" src="https://picsum.photos/seed/md1-accents-market/640/360" />

            <Md1Card.Actions>
              <Md1Button>Open</Md1Button>
            </Md1Card.Actions>
          </Md1Card>

          <div class="md1-docs-accents-tonal md1-elevation-2">
            <p class="md1-docs-accents-tonal-headline md1-type-title">Saved for later</p>

            <p class="md1-docs-accents-tonal-text md1-type-body-1">12 photos in 3 albums</p>
          </div>
        </div>

        <Md1Fab aria-label="Add photo" icon="add" />
      </div>

      <figcaption class="md1-docs-note">Colourless bars and a monochrome accent let the photograph lead; a darker and a lighter tone of the primary give a monochrome card its accent</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-accents {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
    gap: var(--md1-spacing-3, 24px) var(--md1-spacing-2, 16px);
    width: 100%;
    align-items: start;
  }

  .md1-docs-accents-item {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    min-width: 0;
    margin: 0;
  }

  /* A handset screen; containment makes it the fixed FAB's containing block. */
  .md1-docs-accents-screen {
    position: relative;
    height: 420px;
    overflow: clip;
    contain: layout paint;
    background: var(--md1-background, #FAFAFA);
    box-shadow: inset 0 0 0 1px var(--md1-divider, rgba(0, 0, 0, 0.12));
  }

  /* The status bar: the primary's 700 tone over a primary app bar (colour page). */
  .md1-docs-accents-status {
    height: 24px;
    background: var(--md1-primary-dark, #303F9F);
  }

  .md1-docs-accents-related {
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
    color: var(--md1-black, #000000);
    background: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-accents-primary-icon {
    color: var(--md1-primary, #3F51B5);
  }

  /* The reverse pairing: the system bar in the primary, the app bar in its darker tone. */
  .md1-docs-accents-status-light {
    background: var(--md1-primary, #3F51B5);
  }

  .md1-docs-accents-dark-bar {
    --md1-primary: var(--md1-primary-dark, #303F9F);
  }

  /* The checkboxes take the primary as their accent: the role is retuned on their subtree. */
  .md1-docs-accents-primary-accent {
    --md1-accent: var(--md1-primary, #3F51B5);

    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px);
  }

  /* A very dark strip: the dark theme's accent control is the accent's lighter 200 tone. */
  .md1-docs-accents-night {
    margin-top: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px);
    background: var(--md1-grey-900, #212121);
  }

  .md1-docs-accents-hero {
    position: relative;
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px) var(--md1-spacing-4, 32px);
    background: var(--md1-primary, #3F51B5);
  }

  /* Important text in a contrasting tone of the accent against the primary. */
  .md1-docs-accents-hero-headline {
    margin: 0;
    color: color-mix(in srgb, var(--md1-accent, #FF4081) 35%, var(--md1-white, #FFFFFF));
  }

  .md1-docs-accents-hero-text {
    margin: 0;
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* A button resting on the primary takes a lighter tone of the primary rather than the accent. */
  .md1-docs-accents-hero .md1-docs-accents-tonal-fab {
    --md1-accent: var(--md1-primary-light, #C5CAE9);
    --md1-on-accent: var(--md1-primary-dark, #303F9F);

    position: absolute;
    inset-inline-end: var(--md1-keyline-margin, 16px);
    bottom: -28px;
  }

  .md1-docs-accents-copy {
    padding: var(--md1-spacing-4, 32px) var(--md1-keyline-margin, 16px) var(--md1-spacing-2, 16px);
  }

  .md1-docs-accents-headline {
    margin: 0 0 var(--md1-spacing-1, 8px);
    color: var(--md1-primary, #3F51B5);
  }

  .md1-docs-accents-body {
    margin: 0;
  }

  .md1-docs-accents-link {
    color: var(--md1-accent, #FF4081);
  }

  .md1-docs-accents-link-primary {
    color: var(--md1-primary, #3F51B5);
  }

  .md1-docs-accents-actions {
    display: flex;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    margin-top: var(--md1-spacing-2, 16px);
  }

  /* The primary action button in the accent: the raised button reads the primary, so the accent is mapped onto it here. */
  .md1-docs-accents-secondary-action {
    --md1-primary: var(--md1-accent, #FF4081);
    --md1-primary-dark: var(--md1-accent, #FF4081);
    --md1-on-primary: var(--md1-on-accent, #FFFFFF);
  }

  /* Monochrome: the accent becomes white with dark ink, so the photograph carries the colour. */
  .md1-docs-accents-mono {
    --md1-accent: var(--md1-white, #FFFFFF);
    --md1-on-accent: rgb(0 0 0 / 0.87);
  }

  .md1-docs-accents-mono .md1-button {
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-docs-accents-mono-content {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
  }

  .md1-docs-accents-tonal {
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-primary-light, #C5CAE9);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-docs-accents-tonal-headline {
    margin: 0;
    color: var(--md1-primary-dark, #303F9F);
  }

  .md1-docs-accents-tonal-text {
    margin: 0;
    color: var(--md1-primary-dark, #303F9F);
  }

  /* On the dark theme the primary as ink takes its 100 tone: Indigo 500 reads under 3:1 on #303030 (colour page, dark theme ink). */
  [data-theme='md1-dark'] :is(.md1-docs-accents-primary-icon, .md1-docs-accents-headline, .md1-docs-accents-link-primary) {
    color: var(--md1-primary-light, #C5CAE9);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
