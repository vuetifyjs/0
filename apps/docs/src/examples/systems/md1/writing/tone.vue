<script setup lang="ts">
  import { Md1Button, Md1Card, Md1List, Md1ProgressCircular, Md1Snackbar, Md1TextField } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const file = shallowRef('Holiday photos')
  const failed = shallowRef(true)

  // Snackbars always time out (snackbars page). Try again, or the timeout,
  // dismisses this one; the send fails again here, so it comes back.
  const retry = useTimer(() => {
    failed.value = true
  }, { duration: 1500 })

  watch(failed, value => {
    if (!value) retry.start()
  })
</script>

<template>
  <div class="md1-docs-writing-stack md1-docs-writing-tone">
    <div class="md1-docs-writing-grid">
      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <p class="md1-docs-writing-dialog-title md1-type-title">MyApp isn’t responding</p>

          <p class="md1-docs-writing-dialog-text md1-type-body-1">Do you want to close it?</p>

          <div class="md1-docs-writing-dialog-actions">
            <Md1Button>Wait</Md1Button>

            <Md1Button>Close app</Md1Button>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">Be friendly, respectful, and focus on the user</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Media ratio="16:9" src="https://picsum.photos/seed/md1-writing-savings/688/387" />

            <Md1Card.Title>All your savings in one place</Md1Card.Title>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">Be humble</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Button>More restaurant reviews</Md1Button>
        </div>

        <figcaption class="md1-docs-writing-rule">Be humble: no superlatives</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <Md1List class="md1-docs-writing-sheet" :lines="3">
          <Md1List.Item>
            <Md1List.Icon name="place" />

            <Md1List.Content>
              <Md1List.Primary>Location mode</Md1List.Primary>

              <Md1List.Secondary>To save power, switch Location mode to Battery saving mode</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>

        <figcaption class="md1-docs-writing-rule">Be inviting</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1TextField v-model="file" :counter="24" helper="Use 24 characters or fewer for file names" label="File name" />
        </div>

        <figcaption class="md1-docs-writing-rule">Be positive</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-snack">
          <Md1Snackbar.Portal :teleport="false">
            <Md1Snackbar v-model="failed" action="Try again">Message not sent</Md1Snackbar>
          </Md1Snackbar.Portal>
        </div>

        <figcaption class="md1-docs-writing-rule">Be positive: offer the way forward</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <div class="md1-docs-writing-dialog-progress">
            <Md1ProgressCircular aria-label="Signing in" />

            <div>
              <p class="md1-docs-writing-dialog-heading md1-type-subheading">Signing in…</p>

              <p class="md1-docs-writing-body md1-type-body-1">Your phone is contacting Google. This can take up to five minutes.</p>
            </div>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">Be essential</figcaption>
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
  /* The progress dialog: the indicator at the start, a short heading and one line of essential detail. */
  .md1-docs-writing-dialog-progress {
    display: flex;
    align-items: flex-start;
    gap: var(--md1-spacing-3, 24px);
    padding: var(--md1-spacing-3, 24px);
  }

  .md1-docs-writing-dialog-heading {
    margin: 0 0 var(--md1-spacing-1, 8px);
  }
</style>
