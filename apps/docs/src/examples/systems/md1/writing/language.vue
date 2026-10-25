<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon, Md1List, Md1ProgressLinear, Md1Snackbar, Md1Switch, Md1TextField } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, watch } from 'vue'

  const history = shallowRef(false)
  const circle = shallowRef('Close friends')

  // Snackbars always time out (snackbars page); the gallery brings them back a moment later.
  const shown = shallowRef(true)
  const replay = useTimer(() => {
    shown.value = true
  }, { duration: 1500 })

  watch(shown, value => {
    if (!value) replay.start()
  })
</script>

<template>
  <div class="md1-docs-writing-stack">
    <div class="md1-docs-writing-grid">
      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Supporting>Text should be simple, concise, and direct</Md1Card.Supporting>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">Style</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-empty">
          <Md1Icon class="md1-docs-writing-empty-art" name="thumb-up" />

          <p class="md1-docs-writing-empty-text">Get started with these popular posts on Google+</p>
        </div>

        <figcaption class="md1-docs-writing-rule">Avoid the pronoun “we”</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-snack">
          <Md1Snackbar.Portal :teleport="false">
            <Md1Snackbar v-model="shown" multiline>We’ll review your appeal and respond within a few days</Md1Snackbar>
          </Md1Snackbar.Portal>
        </div>

        <figcaption class="md1-docs-writing-rule">“We” when a person acts for the user</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Supporting>Send money to anyone in the US who has an email address. It’s fast, easy, and free.</Md1Card.Supporting>

            <Md1Card.Actions>
              <Md1Button>Send money</Md1Button>
            </Md1Card.Actions>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">Be concise</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-empty">
          <Md1Icon class="md1-docs-writing-empty-art" name="help-outline" />

          <p class="md1-docs-writing-empty-text">Read the instructions that came with your phone</p>
        </div>

        <figcaption class="md1-docs-writing-rule">Keep sentences short</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <p class="md1-docs-writing-dialog-title md1-type-title">Save changes?</p>

          <div class="md1-docs-writing-dialog-actions">
            <Md1Button>Cancel</Md1Button>

            <Md1Button>Save</Md1Button>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">Write simply and directly</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-snack">
          <Md1Snackbar.Portal :teleport="false">
            <Md1Snackbar v-model="shown">Message sent</Md1Snackbar>
          </Md1Snackbar.Portal>
        </div>

        <figcaption class="md1-docs-writing-rule">Present tense</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Button variant="raised">Register to vote</Md1Button>
        </div>

        <figcaption class="md1-docs-writing-rule">Omit introductory phrases</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <Md1List class="md1-docs-writing-sheet">
          <Md1List.Item>
            <Md1List.Content>
              <Md1List.Primary>Turn on Location History</Md1List.Primary>
            </Md1List.Content>

            <Md1List.Action>
              <Md1Switch v-model="history" aria-label="Turn on Location History" />
            </Md1List.Action>
          </Md1List.Item>
        </Md1List>

        <figcaption class="md1-docs-writing-rule">Write for all levels of readers</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad md1-docs-writing-progress">
          <p class="md1-docs-writing-body md1-type-body-1">Preparing video…</p>

          <Md1ProgressLinear aria-label="Preparing video" />
        </div>

        <figcaption class="md1-docs-writing-rule">No industry terms</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-snack">
          <Md1Snackbar.Portal :teleport="false">
            <Md1Snackbar v-model="shown" multiline>“Ok Google” isn’t supported on your phone</Md1Snackbar>
          </Md1Snackbar.Portal>
        </div>

        <figcaption class="md1-docs-writing-rule">No names invented for the UI</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1Card>
            <Md1Card.Supporting>Click <strong>Continue</strong></Md1Card.Supporting>

            <Md1Card.Actions>
              <Md1Button variant="raised">Continue</Md1Button>
            </Md1Card.Actions>
          </Md1Card>
        </div>

        <figcaption class="md1-docs-writing-rule">Refer to the label, not the element</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <Md1List class="md1-docs-writing-sheet">
          <Md1List.Item>
            <Md1List.Icon name="delete" />

            <Md1List.Content>
              <Md1List.Primary>Remove photo</Md1List.Primary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>

        <figcaption class="md1-docs-writing-rule">One verb for one action</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <p class="md1-docs-writing-dialog-title md1-type-title">Remove photo?</p>

          <div class="md1-docs-writing-dialog-actions">
            <Md1Button>Cancel</Md1Button>

            <Md1Button>Remove</Md1Button>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">A short dialog title, the same verb</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <Md1List class="md1-docs-writing-sheet" :lines="2">
          <Md1List.Item>
            <Md1List.Avatar>
              <Md1Icon name="inbox" />
            </Md1List.Avatar>

            <Md1List.Content>
              <Md1List.Primary>Inbox</Md1List.Primary>

              <Md1List.Secondary>You have 3 messages</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1List>

        <figcaption class="md1-docs-writing-rule">Numerals, not words</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-empty">
          <Md1Icon class="md1-docs-writing-empty-art" name="photo" />

          <p class="md1-docs-writing-empty-text">To remove a photo from this album, drag it to the trash</p>
        </div>

        <figcaption class="md1-docs-writing-rule">Begin with the objective</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-dialog md1-elevation-24">
          <p class="md1-docs-writing-dialog-title md1-type-title">Remove downloaded book?</p>

          <div class="md1-docs-writing-dialog-actions">
            <Md1Button>Cancel</Md1Button>

            <Md1Button>Remove</Md1Button>
          </div>
        </div>

        <figcaption class="md1-docs-writing-rule">Reveal detail as needed</figcaption>
      </figure>

      <figure class="md1-docs-writing-item">
        <div class="md1-docs-writing-pad">
          <Md1TextField v-model="circle" helper="Your circle names aren’t shared" label="Circle name" />
        </div>

        <figcaption class="md1-docs-writing-rule">Never say “never”</figcaption>
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
