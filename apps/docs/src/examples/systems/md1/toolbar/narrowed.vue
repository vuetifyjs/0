<script setup lang="ts">
  import { Md1Button, Md1List, Md1Toolbar } from '@paper/md1'
  import { useId } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const open = shallowRef(false)
  const id = useId()

  const photos = [
    { name: 'Harbour at dawn', taken: 'June 3, 2016' },
    { name: 'Market stalls', taken: 'June 4, 2016' },
    { name: 'Lighthouse steps', taken: 'June 4, 2016' },
    { name: 'Fishing boats', taken: 'June 5, 2016' },
    { name: 'Cliff path', taken: 'June 6, 2016' },
  ]
</script>

<template>
  <div class="md1-docs-screen md1-docs-narrow-screen" :data-narrow="open || undefined">
    <Md1Toolbar class="md1-docs-narrow-toolbar" variant="primary">
      <Md1Toolbar.Nav />

      <Md1Toolbar.Title>Cornwall trip</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button aria-label="Share" icon="share" />

        <Md1Button
          :aria-controls="id"
          :aria-expanded="open"
          aria-label="Album details"
          icon="info"
          @click="open = !open"
        />
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <Md1List class="md1-docs-narrow-list" :lines="2">
      <Md1List.Item v-for="photo in photos" :key="photo.name">
        <Md1List.Icon name="photo" />

        <Md1List.Content>
          <Md1List.Primary>{{ photo.name }}</Md1List.Primary>

          <Md1List.Secondary>{{ photo.taken }}</Md1List.Secondary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>

    <aside
      :id
      aria-label="Album details"
      class="md1-docs-narrow-sheet"
      :data-open="open || undefined"
      :inert="!open || undefined"
    >
      <div class="md1-docs-narrow-sheet-head">
        <span class="md1-docs-narrow-sheet-title">Details</span>

        <Md1Button aria-label="Close details" icon="close" @click="open = false" />
      </div>

      <p class="md1-docs-narrow-sheet-text">Size: 18 MB, 5 photos</p>

      <p class="md1-docs-narrow-sheet-text">Shared with Ana and Tomás</p>
    </aside>
  </div>
</template>

<style>
  .md1-docs-narrow-screen {
    --md1-docs-narrow-sheet: 240px;

    background: var(--md1-background, #FAFAFA);
  }

  /*
   * The toolbar gives way to the sheet passing over it instead of being split
   * by it: its width shrinks to the room left, and its actions stay clustered
   * at its end edge (toolbars page). 300 ms on the standard curve, the
   * sheet's own movement.
   */
  .md1-docs-narrow-toolbar {
    inline-size: 100%;
    transition: inline-size var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .md1-docs-narrow-screen[data-narrow] .md1-docs-narrow-toolbar {
    inline-size: calc(100% - var(--md1-docs-narrow-sheet));
  }

  .md1-docs-narrow-list {
    background: var(--md1-surface, #FFFFFF);
  }

  /* The passing sheet: the screen's full height at the end edge, a step above the toolbar's 4 dp. */
  .md1-docs-narrow-sheet {
    position: absolute;
    z-index: 1;
    inset-block: 0;
    inset-inline-end: 0;
    box-sizing: border-box;
    inline-size: var(--md1-docs-narrow-sheet);
    padding: 0 var(--md1-spacing-2, 16px);
    background: var(--md1-surface, #FFFFFF);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    box-shadow: var(--md1-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    transform: translateX(calc(100% + 16px));
    visibility: hidden;
    transition:
      transform var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      visibility 0s linear var(--md1-duration-standard, 300ms);
  }

  .md1-docs-narrow-sheet:dir(rtl) {
    transform: translateX(calc(-100% - 16px));
  }

  .md1-docs-narrow-sheet[data-open] {
    transform: none;
    visibility: visible;
    transition-delay: 0s;
  }

  .md1-docs-narrow-sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    block-size: var(--md1-increment, 56px);
  }

  .md1-docs-narrow-sheet-title {
    font-size: var(--md1-type-title-size, 20px);
    font-weight: var(--md1-type-title-weight, 500);
  }

  .md1-docs-narrow-sheet-text {
    margin: 0 0 var(--md1-spacing-1, 8px);
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  @media (prefers-reduced-motion: reduce) {
    .md1-docs-narrow-toolbar,
    .md1-docs-narrow-sheet {
      transition: none;
    }
  }
</style>
