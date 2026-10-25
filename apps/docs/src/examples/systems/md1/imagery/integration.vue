<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon, Md1List, Md1Toolbar } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-imagery-integration">
    <figure class="md1-docs-imagery-item">
      <div class="md1-docs-imagery-layout">
        <Md1Card class="md1-docs-imagery-feature">
          <Md1Card.Media ratio="16:9" src="https://picsum.photos/seed/md1-imagery-feature/688/387">
            <Md1Card.Title>Ten days in the Azores</Md1Card.Title>
          </Md1Card.Media>
        </Md1Card>

        <Md1Card>
          <Md1Card.Media ratio="1:1" src="https://picsum.photos/seed/md1-imagery-crater/320/320" />

          <Md1Card.Supporting>Crater lakes</Md1Card.Supporting>
        </Md1Card>

        <Md1Card>
          <Md1Card.Title>Packing list</Md1Card.Title>

          <Md1Card.Supporting>Rain shell, boots, a swimsuit for the hot springs</Md1Card.Supporting>
        </Md1Card>
      </div>

      <figcaption class="md1-docs-note">Feature image: the bold focus of a layout of mixed containers</figcaption>
    </figure>

    <figure class="md1-docs-imagery-item">
      <div class="md1-docs-imagery-hero md1-elevation-2">
        <Md1Toolbar>
          <Md1Toolbar.Nav icon="up" />

          <Md1Toolbar.Extension image="https://picsum.photos/seed/md1-imagery-vineyard/800/450" ratio="16:9">
            <Md1Toolbar.Title>Douro valley</Md1Toolbar.Title>
          </Md1Toolbar.Extension>
        </Md1Toolbar>

        <Md1List :lines="2">
          <Md1List.Item>
            <Md1List.Icon name="schedule" />

            <Md1List.Content>
              <Md1List.Primary>Open daily</Md1List.Primary>

              <Md1List.Secondary>10:00 to 18:00</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>

          <Md1List.Item>
            <Md1List.Icon name="place" />

            <Md1List.Content>
              <Md1List.Primary>Pinhão</Md1List.Primary>

              <Md1List.Secondary>2 hours from Porto</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>
      </div>

      <figcaption class="md1-docs-note">Integrated hero image: sets the scene, the content below is the focus</figcaption>
    </figure>

    <figure class="md1-docs-imagery-item">
      <div class="md1-docs-imagery-gallery">
        <div class="md1-docs-imagery-gallery-bar">
          <Md1Button aria-label="Close" icon="close" />

          <span class="md1-docs-imagery-gallery-count md1-type-title">3 of 12</span>

          <Md1Button aria-label="Share" icon="share" />
        </div>

        <img alt="Terraced vineyards above a river" class="md1-docs-imagery-gallery-image" src="https://picsum.photos/seed/md1-imagery-gallery/800/600">
      </div>

      <figcaption class="md1-docs-note">Gallery image: one image, edge to edge, chrome kept to a minimum</figcaption>
    </figure>

    <figure class="md1-docs-imagery-item">
      <div class="md1-docs-imagery-overlay">
        <img alt="" class="md1-docs-imagery-overlay-image" src="https://picsum.photos/seed/md1-imagery-overlay/800/600">

        <div class="md1-docs-imagery-overlay-text">
          <Md1Icon class="md1-docs-imagery-overlay-icon" name="favorite" />

          <p class="md1-docs-imagery-overlay-title md1-type-display-1">Summer sessions</p>
        </div>
      </div>

      <figcaption class="md1-docs-note">Colour overlay: the primary over the whole image, a design element rather than text protection</figcaption>
    </figure>
  </div>
</template>

<style>
  .md1-docs-imagery-integration {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    align-items: start;
  }

  .md1-docs-imagery-item {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    min-width: 0;
    margin: 0;
  }

  /* Mixed containers on the background: the feature spans the row, two smaller cards share the next. */
  .md1-docs-imagery-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-1, 8px);
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-imagery-feature {
    grid-column: 1 / -1;
  }

  .md1-docs-imagery-hero {
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
  }

  /* The gallery view sits on black whatever the theme: the image is the screen. */
  .md1-docs-imagery-gallery {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    aspect-ratio: 3 / 4;
    background: var(--md1-black, #000000);
  }

  .md1-docs-imagery-gallery-bar {
    position: absolute;
    inset-inline: 0;
    top: 0;
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    height: var(--md1-increment, 56px);
    padding: 0 4px;
    color: var(--md1-white, #FFFFFF);
    background: linear-gradient(to bottom, rgb(0 0 0 / 0.4), transparent);
  }

  .md1-docs-imagery-gallery-bar .md1-button {
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-imagery-gallery-count {
    flex: 1;
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-imagery-gallery-image {
    display: block;
    width: 100%;
  }

  .md1-docs-imagery-overlay {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: clip;
    background: var(--md1-primary, #3F51B5);
  }

  /* Multiply keeps the photograph's light and shade under the hue, the way a duotone print does. */
  .md1-docs-imagery-overlay-image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(1);
    mix-blend-mode: multiply;
  }

  .md1-docs-imagery-overlay-text {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--md1-spacing-1, 8px);
    padding: var(--md1-spacing-2, 16px);
    text-align: center;
  }

  .md1-docs-imagery-overlay-icon {
    --md1-icon-size: 48px;

    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-imagery-overlay-title {
    margin: 0;
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
